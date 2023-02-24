import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CommentInput from '../components/comment/CommentInput';
import CommentsList from '../components/comment/CommentsList';
import basicIMG from '../styles/basicIMG.png';
import { FcLikePlaceholder } from 'react-icons/fc';
import {
  customConfirm,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import { onSalePostType } from '../types';
import parse from 'html-react-parser';
import SignIn from './SignIn';
import * as a from '../styles/styledComponent/detail';

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
  const queryClient = useQueryClient();

  // 클릭한 글의 데이터를 가지고 옵니다.
  // 쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
  const { data: post, isLoading } = useQuery(['post', id], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_JSON}/posts?id=${id}`
    );
    return response.data;
  });

  // onSalePosts 데이터가 생성 코드
  const { mutate: onSalePosts } = useMutation((newSalePosts: onSalePostType) =>
    axios.post(`${process.env.REACT_APP_JSON}/onSalePosts`, newSalePosts)
  );

  // 판매자의 프로필이미지를 위해 데이터 가져오기
  const { data: seller } = useQuery(
    ['user', post?.[0].sellerUid],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/users/${post?.[0].sellerUid}`
      );
      return response.data;
    },
    {
      enabled: Boolean(post?.[0].sellerUid), // saveUser?.uid가 존재할 때만 쿼리를 시작
    }
  );

  // 포인트 수정을 위한 유저정보 get
  const { data: user } = useQuery(
    ['user', saveUser?.uid],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/users/${post?.[0].sellerUid}`
      );
      return response.data;
    },
    {
      enabled: Boolean(saveUser?.uid), // saveUser?.uid가 존재할 때만 쿼리를 시작
    }
  );

  // 포인트를 수정해주는 mutation 함수
  const { mutate: updateUser } = useMutation(
    (newUser: { point: string | number | undefined }) =>
      axios.patch(
        `${process.env.REACT_APP_JSON}/users/${saveUser?.uid}`,
        newUser
      )
  );

  // 좋아요 기능을 위해
  const { mutate: updateSeller } = useMutation(
    (newUser: { like: string[] }) =>
      axios.patch(`${process.env.REACT_APP_JSON}/users/${seller?.id}`, newUser),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', seller?.id]);
        setSellerData((prev: any) => ({
          ...prev,
          like: countCheck
            ? prev.like.filter((prev: any) => prev !== saveUser?.uid)
            : [...(prev.like || []), saveUser?.uid],
        }));
      },
      onError: (error) => {
        console.dir(error);
      },
    }
  );

  // 글 찜 기능을 위해
  const postCountCheck = post?.[0].like.includes(saveUser?.uid);

  const { mutate: updatePost } = useMutation(
    (newPosts: { like: string[] }) =>
      axios.patch(`${process.env.REACT_APP_JSON}/posts/${id}`, newPosts),

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

  // 글 삭제
  const { mutate: deletePost } = useMutation(
    (postId: string) =>
      axios.delete(`${process.env.REACT_APP_JSON}/posts/${id}`),
    {
      // 댓글을 성공적으로 삭제했다면 쿼리무효화를 통해 ui에 바로 업뎃될 수 있도록 해줍니다.
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
        navigate('/categorypage/all');
      },
    }
  );
  const onClickDeleteComment = async (postId: string) => {
    customConfirm('정말 삭제하시겠습니까?', '내 글 삭제', '삭제', async () => {
      await deletePost(postId);
    });
  };
  const postCounter = async () => {
    if (saveUser) {
      if (postCountCheck) {
        await updatePost({
          like: post?.[0].like.filter((prev: any) => prev !== saveUser?.uid),
        });
      } else {
        await updatePost({
          like: [...(post?.[0].like || []), saveUser?.uid],
        });
      }
    } else {
      return <SignIn />;
    }
  };

  const countCheck = seller?.like.includes(saveUser?.uid);

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
        views: post?.[0]?.views,
        like: post?.[0]?.like,
      });
      setTimeout(() => {
        navigate(`/detail/${categoryName}/${id}/${user.uid}/${uuid}`);
      }, 500);
    } else {
      customWarningAlert('포인트가 부족합니다.');
    }
  };
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
          <a.SellerText>판매자</a.SellerText>
          <a.SellerProfileContainer>
            <a.SellerWrapper>
              <a.SellerLeft>
                <a.ProfileIMG
                  profileIMG={
                    seller?.profileImg ? seller?.profileImg : basicIMG
                  }
                  aria-label="프로필 이미지"
                />
              </a.SellerLeft>
              <a.SellerRight>
                <p>{post[0].nickName}</p>
              </a.SellerRight>
            </a.SellerWrapper>
            <a.SellerProfileWrapper>
              <a.BottomTopContainer>
                <a.ContactTimeContainer>
                  <p>연락가능시간</p>
                  <span>
                    {post[0].contactTime
                      ? post[0].contactTime
                      : '00:00 ~ 24:00'}
                  </span>
                </a.ContactTimeContainer>
              </a.BottomTopContainer>
              <a.DetailBottomWrapper>
                <a.ProfileButtonContainer>
                  <button aria-label="판매상품 10개">판매상품 10개</button>
                  <button aria-label="받은 후기">받은 후기</button>
                </a.ProfileButtonContainer>
              </a.DetailBottomWrapper>
            </a.SellerProfileWrapper>
          </a.SellerProfileContainer>
          <a.LikeAndSubmitContainer>
            <a.PostLikeButtonContainer>
              {postCountCheck ? (
                <a.HeartIcon onClick={postCounter} aria-label="좋아요 더하기" />
              ) : (
                <FcLikePlaceholder
                  onClick={postCounter}
                  aria-label="좋아요 빼기"
                />
              )}
            </a.PostLikeButtonContainer>
            <button onClick={onClickApplyBuy} aria-label="바로 신청하기">
              바로 신청하기
            </button>
          </a.LikeAndSubmitContainer>
        </a.PostInfoWrapper>
      </a.PostContainer>
      <a.PostContentWrapper>
        <div>{parse(post[0].content)}</div>
      </a.PostContentWrapper>
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
