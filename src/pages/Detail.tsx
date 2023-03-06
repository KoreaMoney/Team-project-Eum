import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CommentsList from '../components/comment/CommentsList';
import {
  customConfirm,
  customSuccessAlert,
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
import axios from 'axios';
import Loader from '../components/etc/Loader';

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
  const [isDrop, setIsDrop] = useState(false);
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const location = useLocation();
  const [sellerData, setSellerData] = useState<{ like: any[] }>({ like: [] });
  const [postData, setPostData] = useState<{ like: any[] }>({ like: [] });
  const [isCancel, setIsCancel] = useRecoilState(isCancelAtom);
  const [isDone, setIsDone] = useRecoilState(isDoneAtom);
  const queryClient = useQueryClient();
  const [isDescriptionActive, setIsDescriptionActive] = useState(true);
  const [isReviewActive, setIsReviewActive] = useState(false);
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

  /**판매중인 글 */
  const { data: myOnSale } = useQuery(['myOnSale'], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_JSON}/onSalePosts?sellerUid=${
        saveUser.uid
      }&isDone=${false}&isCancel=${false}`
    );
    return response.data;
  });

  console.log('myOnSale: ', myOnSale);

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

  /**글 삭제 */
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
    return (
      <div>
        <Loader />
      </div>
    );
  }
  if (!post || post.length === 0) {
    return <div>No data found</div>;
  }

  /**바로 신청하기 버튼 클릭
   * user 데이터의 point가 price만큼 빠지고
   * mutate로 데이터를 저장합니다
   */

  const onClickApplyBuy = () => {
    customConfirm(
      '거래를 하시겠습니까?',
      '확인을 누르시면 포인트가 차감됩니다.',
      '확인',
      async () => {
        if (!saveUser) {
          navigate('/signin', { state: { from: location.pathname } });
          return;
        }

        /**null인 경우 0으로 초기화 */
        const point = Number(user?.point) || 0;
        const price = Number(post?.[0]?.price) || 0;

        /**구매자의 포인트에서 price만큼 뺀걸 구매자의 user에 업데이트 */
        if (point >= price) {
          await updateUser({ point: point - price });
          const uuid = uuidv4();
          await onSalePosts({
            id: uuid,
            postsId: id,
            buyerUid: saveUser.uid,
            sellerUid: post?.[0]?.sellerUid,
            sellerNickName: post?.[0]?.nickName,
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
            reviewDone: false,
          });
          setTimeout(() => {
            navigate(`/detail/${categoryName}/${id}/${user.id}/${uuid}`);
          }, 500);
        } else {
          customWarningAlert('포인트가 부족합니다.');
        }
      }
    );
  };

  /**화면 중간 네브바*/
  const onClickNavExSeller = () => {
    setIsDescriptionActive(true);
    setIsReviewActive(false);
    scrollToTop();
  };
  const onClickNavReview = () => {
    setIsDescriptionActive(false);
    setIsReviewActive(true);
    goRivew();
  };

  /**현재 URL 복사 */
  const linkCopy = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        customSuccessAlert('복사되었습니다.');
      })
      .catch((error) => {
        console.error(`Could not copy URL to clipboard: ${error}`);
      });
  };

  /**설명이나 판매자 누르면 맨위로 */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**후기 누르면 후기로 */
  const goRivew = () => {
    window.scrollTo({
      top: 1306,
      behavior: 'smooth',
    });
  };

  return (
    <a.DetailContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <a.PostContainer>
            <a.PostImage img={post[0].imgURL} aria-label="post이미지" />
            <a.PostInfoWrapper>
              <a.InfoTopContainer>
                <a.InfoTopLeftContainer>
                  <p>
                    {post?.[0].category === 'all'
                      ? '전체'
                      : post?.[0].category === 'study'
                      ? '공부'
                      : post?.[0].category === 'play'
                      ? '놀이'
                      : post?.[0].category === 'advice'
                      ? '상담'
                      : post?.[0].category === 'etc'
                      ? '기타'
                      : '전체'}
                  </p>
                </a.InfoTopLeftContainer>
                <a.InfoTopRightContainer>
                  <a.IconLeftContainer>
                    <a.HeartIcon />
                    <a.LikeLength>{post?.[0].like.length}</a.LikeLength>
                  </a.IconLeftContainer>
                  <a.IconRigntContainer>
                    <a.ShareIcon onClick={linkCopy} />
                  </a.IconRigntContainer>
                </a.InfoTopRightContainer>
              </a.InfoTopContainer>
              <a.TextContainer>
                <a.TitleText>{post?.[0].title}</a.TitleText>
                {saveUser?.uid === post?.[0].sellerUid && (
                  <a.DropDonwContainer>
                    <a.KebobIcon onClick={() => setIsDrop(!isDrop)} />
                    {isDrop && (
                      <a.DropDownBox>
                        <a.DropDownButton
                          onClick={() => navigate(`/editpage/${id}`)}
                          aria-label="수정"
                        >
                          게시글 수정
                        </a.DropDownButton>
                        <a.DropDownButton
                          onClick={() => onClickDeleteComment(post?.[0].id)}
                        >
                          삭제
                        </a.DropDownButton>
                      </a.DropDownBox>
                    )}
                  </a.DropDonwContainer>
                )}
              </a.TextContainer>
              <a.PostNickName>{post?.[0].nickName}</a.PostNickName>
              <a.PostPrice>
                {post[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                P
              </a.PostPrice>
              <a.LikeContainer>
                {postCountCheck ? (
                  <>
                    <a.LikeButtonContainer
                      onClick={postCounter}
                      aria-label="좋아요 더하기"
                    >
                      <a.LikeIcon />
                    </a.LikeButtonContainer>
                    {saveUser?.uid === post?.[0].sellerUid ? (
                      <a.LikeSubmitButton
                        onClick={onClickApplyBuy}
                        aria-label="판매중"
                      >
                        판매중({myOnSale.length === 0 ? '0' : myOnSale.length})
                      </a.LikeSubmitButton>
                    ) : (
                      <a.LikeSubmitButton
                        onClick={onClickApplyBuy}
                        aria-label="바로 구매하기"
                      >
                        바로 구매하기
                      </a.LikeSubmitButton>
                    )}
                  </>
                ) : (
                  <>
                    <a.NoLikeButtonContainer
                      onClick={postCounter}
                      aria-label="좋아요 빼기"
                    >
                      <a.NoLikeIcon />
                    </a.NoLikeButtonContainer>

                    {saveUser?.uid === post?.[0].sellerUid ? (
                      <a.LikeSubmitButton
                        onClick={onClickApplyBuy}
                        aria-label="판매중"
                      >
                        판매중({myOnSale?.length ? myOnSale?.length : 0})
                      </a.LikeSubmitButton>
                    ) : (
                      <a.LikeSubmitButton
                        onClick={onClickApplyBuy}
                        aria-label="바로 구매하기"
                      >
                        바로 구매하기
                      </a.LikeSubmitButton>
                    )}
                  </>
                )}
              </a.LikeContainer>
            </a.PostInfoWrapper>
          </a.PostContainer>
          <a.NavContainer>
            <a.NavButtons
              active={isDescriptionActive}
              onClick={onClickNavExSeller}
            >
              설명
            </a.NavButtons>
            <a.NavButtons
              active={isDescriptionActive}
              onClick={onClickNavExSeller}
            >
              판매자
            </a.NavButtons>
            <a.NavButtons
              active={isReviewActive}
              style={{ borderRight: 'none' }}
              onClick={onClickNavReview}
            >
              후기
            </a.NavButtons>
          </a.NavContainer>

          <a.PostRow>
            <a.PostContentWrapper>
              <a.SellerInfoTitle>
                <p>설명</p>
              </a.SellerInfoTitle>
              <a.SellerInfoContent>
                <p>{parse(post[0].content)}</p>
              </a.SellerInfoContent>
            </a.PostContentWrapper>
            <a.PostContentWrapper>
              <a.SellerInfoTitle>
                <p>판매자</p>
              </a.SellerInfoTitle>
                <SellerInfo />
                <a.KakaoButton>카카오톡으로 문의하기</a.KakaoButton>
            </a.PostContentWrapper>
          </a.PostRow>
          <div>
            <div>
              <CommentsList />
            </div>
          </div>
        </>
      )}
    </a.DetailContainer>
  );
};

export default Detail;
