import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CommentInput from '../components/comment/CommentInput';
import CommentsList from '../components/comment/CommentsList';

import { FcLikePlaceholder } from 'react-icons/fc';
import {
  customConfirm,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import { onSalePostType } from '../types';
import parse from 'html-react-parser';
import * as a from '../styles/styledComponent/detail';
import {
  deletePosts,
  getPostsId,
  getUsers,
  patchPosts,
  patchUsers,
  postOnSalePost,
} from '../api';
import SellerInfo from '../components/detail/SellerInfo';
import { useRecoilState } from 'recoil';
import { isCancelAtom, isDoneAtom } from '../atom';

/**순서
 * 1. query구성을 진행하여 데이터를 get함
 * 2. 판매자 uid 가져오기
 * 3. 포인트 수정
 * 4. 포인트 수정후 저장
 * 5. 글 찜 기능 추가
 * 6. 글 찜 기능 수정, 삭제
 * 7. 댓글 수정 삭제
 * 8. 구매자 포인트 신청
 * 9. 포인트 환불
 */

const Detail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { categoryName } = useParams();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const location = useLocation();
  const [sellerData, setSellerData] = useState<{ like: any[] }>({ like: [] });
  const [postData, setPostData] = useState<{ like: any[] }>({ like: [] });
  const [isCancel, setIsCancel] = useRecoilState(isCancelAtom);
  const [isDone, setIsDone] = useRecoilState(isDoneAtom);
  const queryClient = useQueryClient();

  // 클릭한 글의 데이터를 가지고 옵니다.
  // 쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
  setIsCancel(false);
  setIsDone(false);
  const { data: post, isLoading } = useQuery(
    ['post', id],
    () => getPostsId(id),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
    }
  );

  // onSalePosts 데이터가 생성 코드
  const { mutate: onSalePosts } = useMutation((newSalePosts: onSalePostType) =>
    postOnSalePost(newSalePosts)
  );

  // 판매자의 프로필이미지를 위해 데이터 가져오기
  const { data: seller } = useQuery(
    ['user', post?.[0].sellerUid],
    () => getUsers(post?.[0].sellerUid),
    {
      enabled: Boolean(post?.[0].sellerUid), // post?.[0].sellerUid가 존재할 때만 쿼리를 시작
      staleTime: Infinity,
    }
  );

  // 구매자가 바로신청하기를 누르면 구매자의 정보를 가져오기 위한 함수
  const { data: user } = useQuery(
    ['user', saveUser?.uid],
    () => getUsers(saveUser?.uid),
    {
      enabled: Boolean(saveUser), // saveUser?.uid가 존재할 때만 쿼리를 시작
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (post) {
      queryClient.invalidateQueries(['post', id]);
    }
  }, [post, queryClient, id]);

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries(['user', post?.[0].sellerUid]);
    }
  }, [user, queryClient, post?.[0]?.sellerUid]);

  // 구매자가 바로신청하기를 누르면 구매자의 포인트에서 price만큼 -해주는 mutation 함수
  const { mutate: updateUser } = useMutation(
    (newUser: { point: number | undefined }) =>
      patchUsers(saveUser?.uid, newUser),
    {
      onSuccess: () => queryClient.invalidateQueries(['user', saveUser?.uid]),
    }
  );

  // 글 찜 기능을 위해
  const postCountCheck = post?.[0].like.includes(saveUser?.uid);
  const { mutate: updatePost } = useMutation(
    (newPosts: { like: string[] }) => patchPosts(id, newPosts),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', id]);
        setPostData((prev: any) => ({
          ...prev,
          like: postCountCheck
            ? prev.like.filter((prev: any) => prev !== saveUser?.uid)
            : [...(prev.like || []), saveUser?.uid],
        }));
      },
      onError: (error) => {
        console.dir(error);
      },
    }
  );
  const postCounter = async () => {
    if (!saveUser) navigate('/signin');
    else {
      if (postCountCheck) {
        await updatePost({
          like: post?.[0].like.filter((prev: any) => prev !== saveUser?.uid),
        });
      } else {
        await updatePost({
          like: [...(post?.[0].like || []), saveUser?.uid],
        });
      }
    }
  };

  // 글 삭제
  const { mutate: deletePost } = useMutation((id: string) => deletePosts(id), {
    onSuccess: () => {
      navigate('/categorypage/all');
    },
  });
  const onClickDeleteComment = async (postId: string) => {
    customConfirm('정말 삭제하시겠습니까?', '내 글 삭제', '삭제', async () => {
      await deletePost(postId);
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!post || post.length === 0) {
    return <div>No data found</div>;
  }

  /**바로 신청하기 버튼 클릭
   * user 데이터의 point가 price만큼 빠지고
   * mutate로 데이터를 저장합니다
   */

  const onClickApplyBuy = async () => {
    if (!saveUser) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    /**null인 경우 0으로 초기화 */
    const point = Number(user?.point) || 0;
    const price = Number(post?.[0]?.price) || 0;

    // 구매자의 포인트에서 price만큼 뺀걸 구매자의 user에 업데이트ㄴ
    if (point >= price) {
      await updateUser({ point: point - price });
      const uuid = uuidv4();
      await onSalePosts({
        id: uuid,
        postsId: id,
        buyerUid: saveUser.uid,
        sellerUid: post?.[0]?.sellerUid,
        title: post?.[0]?.title,
        content: post?.[0]?.content,
        imgURL: post?.[0]?.imgURL,
        price: post?.[0]?.price,
        category: post?.[0]?.category,
        createdAt: Date.now(),
        isDone: false,
        isSellerCancel: false,
        isBuyerCancel: false,
        isCancel: false,
        cancelTime: 0,
        doneTime: 0,
      });
      setTimeout(() => {
        navigate(`/detail/${categoryName}/${id}/${user.id}/${uuid}`);
      }, 500);
    } else {
      customWarningAlert('포인트가 부족합니다.');
    }
  };

  // 대신 데이터가 업데이트 될 때만 데이터를 다시 업데이트 해준다.

  return (
    <a.DetailContainer>
      <a.EditBtnWrapper>
        {saveUser?.uid === seller?.id && (
          <>
            <button
              onClick={() => navigate(`/editpage/${id}`)}
              aria-label="수정"
            >
              수정
            </button>
            <button
              onClick={() => onClickDeleteComment(post[0].id)}
              aria-label="삭제"
            >
              삭제
            </button>
          </>
        )}
      </a.EditBtnWrapper>
      <a.PostContainer>
        <a.PostImage img={post[0].imgURL} aria-label="post이미지" />
        <a.PostInfoWrapper>
          <a.TitleText>{post[0].title}</a.TitleText>
          <a.PostPrice>
            {post[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원
          </a.PostPrice>
          <a.LikeAndSubmitContainer>
            {postCountCheck ? (
              <a.PostLikeButtonContainer
                onClick={postCounter}
                aria-label="좋아요 더하기"
              >
                <a.HeartIcon />
              </a.PostLikeButtonContainer>
            ) : (
              <a.PostLikeButtonContainer
                onClick={postCounter}
                aria-label="좋아요 빼기"
              >
                <FcLikePlaceholder />
              </a.PostLikeButtonContainer>
            )}
            <button onClick={onClickApplyBuy} aria-label="바로 신청하기">
              바로 신청하기
            </button>
          </a.LikeAndSubmitContainer>
        </a.PostInfoWrapper>
      </a.PostContainer>
      <a.PostRow>
        <a.PostContentWrapper>
          <a.SellerInfo>
            <p>설명</p>
            {parse(post[0].content)}
          </a.SellerInfo>
        </a.PostContentWrapper>
        <a.PostContentWrapper>
          <a.SellerInfo>
            <p>판매자 정보</p>
            <SellerInfo />
          </a.SellerInfo>
        </a.PostContentWrapper>
      </a.PostRow>
      <div>
        <div>
          {saveUser && <CommentInput />}
          <CommentsList />
        </div>
      </div>
    </a.DetailContainer>
  );
};

export default Detail;
