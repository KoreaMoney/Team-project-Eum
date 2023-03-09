import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from '../styles/theme';
import { deleteUser } from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import { postType } from '../types';
import PointModal from '../components/mypage/PointModal';
import * as a from '../styles/styledComponent/myPage';
import axios from 'axios';
import MemberInfo from '../components/mypage/member/MemberInfo';
import {
  getOnSalePostBuyer,
  getOnSalePostSeller,
  getPosts,
  deleteUsers,
  getLikePostsId,
} from '../api';
import {
  customConfirm,
  customSuccessAlert,
} from '../components/modal/CustomAlert';
import Loader from '../components/etc/Loader';

const MyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState('관심목록');
  const [sellCategory, setSellCategory] = useState('판매중');

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  if (!saveUser) {
    navigate('/signin');
  }
  if (!(saveUser.uid === id)) {
    navigate('/');
  }
  /* 거래 목록을 받아옵니다.
   * 1. 전체 거래 목록을 받아옵니다.
   * 2. 유저가 찜 한 목록을 받아옵니다.
   * 3. 유저의 판매 목록을 받아옵니다.
   */
  const { data: postData, isLoading } = useQuery(['Posts'], () => getPosts());

  const { data: likePostData } = useQuery(['LikePosts', saveUser?.uid], () =>
    getLikePostsId(saveUser?.uid)
  );

  const mySellPostList = postData?.filter((post: any) => {
    return post.sellerUid === saveUser?.uid;
  });

  /* 내 거래 목록을 받아옵니다.
   * 1. 구매 목록을 받아옵니다.
   * 2. 판매 목록을 받아옵니다.
   */
  const { data: tradeBuyData } = useQuery(
    ['onSaleBuyPosts', saveUser?.uid],
    () => getOnSalePostBuyer(saveUser?.uid)
  );

  const { data: tradeSellData } = useQuery(
    ['onSaleSellPosts', saveUser?.uid],
    () => getOnSalePostSeller(saveUser.uid)
  );

  const isDoneTradeSellList = tradeSellData?.filter((post: any) => {
    return post.isDone === true;
  });

  /*회원탈퇴 */
  const user = auth.currentUser;
  const { mutate: deletedUser } = useMutation(
    (id: string | undefined) => deleteUsers(id),
    {
      onSuccess: () => {
        if (user) {
          deleteUser(user)
            .then(() => {
              sessionStorage.removeItem('user');
              customSuccessAlert('탈퇴가 완료되었습니다.');
              navigate('/');
            })
            .catch((error) => {
              console.dir('error: ', error);
            });
        } else {
          alert('회원탈퇴가 진행됩니다.');
        }
      },
    }
  );
  // deleteUsers
  const deleteAuth = () => {
    customConfirm(
      '탈퇴 하시겠습니까?',
      '탈퇴 시 모든 정보는 삭제가 됩니다.\n정말 탈퇴하시겠습니까?',
      '회원 탈퇴',
      async () => {
        await deletedUser(id);
      }
    );
  };

  /* 1. 관심목록에서 포스트 클릭 시 조회수 + 1 후 해당 페이지로 이동합니다.
   * 2. 판매중 목록에서 포스트 클릭 시 해당 페이지로 이동합니다.
   * 3. 판매, 구매목록에서 포스트 클릭 시 해당 페이지로 이동합니다.
   */
  const handleLikePostClick = async (list: postType) => {
    await axios.patch(`${process.env.REACT_APP_JSON}/posts/${list.id}`, {
      views: list.views + 1,
    });
    navigate(`/detail/${list.category}/${list.id}`);
  };

  const handleSellingPostClick = async (list: any) => {
    navigate(`/detail/${list.category}/${list.id}`);
  };

  const handleBuyPostClick = async (list: any) => {
    navigate(
      `/detail/${list.category}/${list.postsId}/${list.buyerUid}/${list.id}`
    );
  };

  // 마이페이지 Nav 클릭시 Nav 이미지
  const categoryStyle = {
    fontSize: `${theme.fontSize.title20}`,
    fontWeight: `${theme.fontWeight.medium}`,
    color: `${theme.colors.orange02Main}`,
  };

  const mySellNavStyle = {
    fontSize: `${theme.fontSize.title20}`,
    fontWeight: `${theme.fontWeight.medium}`,
    color: `${theme.colors.black}`,
    borderBottom: `3px solid ${theme.colors.gray40}`,
  };

  return (
    <a.MyPageContainer>
      <a.MyPageHeader>마이페이지</a.MyPageHeader>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <a.MyPageBody>
            <a.MyPageNavWrapper>
              <a.MyTradeNavWrapper>
                <span>나의 거래</span>
                <div
                  onClick={() => setCategory('관심목록')}
                  style={category === '관심목록' ? categoryStyle : undefined}
                  aria-label="관심목록"
                >
                  관심목록
                </div>
                <div
                  onClick={() => setCategory('나의 판매내역')}
                  style={
                    category === '나의 판매내역' ? categoryStyle : undefined
                  }
                  aria-label="나의 판매내역"
                >
                  나의 판매내역
                </div>
                <div
                  onClick={() => setCategory('구매내역')}
                  style={category === '구매내역' ? categoryStyle : undefined}
                  aria-label="구매내역"
                >
                  구매내역
                </div>
              </a.MyTradeNavWrapper>
              <a.MyInfoNavWrapper>
                <span>회원 정보</span>
                <div
                  onClick={() => setCategory('회원정보 변경')}
                  style={
                    category === '회원정보 변경' ? categoryStyle : undefined
                  }
                  aria-label="회원정보 변경"
                >
                  회원정보 변경
                </div>
                <div
                  onClick={() => setCategory('포인트 관리')}
                  style={category === '포인트 관리' ? categoryStyle : undefined}
                  aria-label="포인트 관리"
                >
                  포인트 관리
                </div>
              </a.MyInfoNavWrapper>
            </a.MyPageNavWrapper>
            <a.MyPageContentsContainer>
              <a.CategoryName>{category}</a.CategoryName>
              {category === '나의 판매내역' ? (
                <a.MySellNav>
                  <div
                    onClick={() => setSellCategory('판매중')}
                    style={
                      sellCategory === '판매중' ? mySellNavStyle : undefined
                    }
                    aria-label="판매중"
                  >
                    매칭중 {mySellPostList?.length}
                  </div>
                  <div
                    onClick={() => setSellCategory('거래완료')}
                    style={
                      sellCategory === '거래완료' ? mySellNavStyle : undefined
                    }
                    aria-label="거래완료"
                  >
                    매칭완료 {isDoneTradeSellList?.length}
                  </div>
                </a.MySellNav>
              ) : null}
              {category === '회원정보 변경' ? (
                <a.MyInfoTop>
                  <a.MyNickName>
                    <span>{saveUser.displayName || ''}</span>님의 회원정보
                  </a.MyNickName>
                  <a.MyInfoTopRight onClick={deleteAuth}>
                    　회원탈퇴
                    <a.RightIcon />
                  </a.MyInfoTopRight>
                </a.MyInfoTop>
              ) : null}
              <a.MyPageContentsWrapper>
                {category === '관심목록'
                  ? likePostData?.map((list: postType) => {
                      return (
                        <a.MyLikeList key={list.id}>
                          <a.LikeImg
                            src="/assets/like.png"
                            alt="찜"
                            loading="lazy"
                          />
                          <a.PostImg
                            src={
                              list?.imgURL
                                ? list.imgURL
                                : '/assets/basicIMG.jpg'
                            }
                            onClick={() => handleLikePostClick(list)}
                          />
                          <a.InfoBest>{list.category}</a.InfoBest>
                          <a.MyLikeDiv>{list.title}</a.MyLikeDiv>
                          <a.MyLikeDiv>
                            {list.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            P
                          </a.MyLikeDiv>
                          <p>{list.nickName}</p>
                        </a.MyLikeList>
                      );
                    })
                  : null}
                {category === '나의 판매내역'
                  ? sellCategory === '판매중'
                    ? mySellPostList?.map((list: any) => {
                        return (
                          <a.MyLikeList key={list.id}>
                            <a.PostImg
                              src={
                                list?.imgURL
                                  ? list.imgURL
                                  : '/assets/basicIMG.jpg'
                              }
                              onClick={() => handleSellingPostClick(list)}
                            />
                            <a.InfoBest>{list.category}</a.InfoBest>
                            <a.MyLikeDiv>{list.title}</a.MyLikeDiv>
                            <a.MyLikeDiv>
                              {list.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              P
                            </a.MyLikeDiv>
                            <p>{list.buyerNickName}</p>
                          </a.MyLikeList>
                        );
                      })
                    : isDoneTradeSellList?.map((list: any) => {
                        return (
                          <a.MyLikeList key={list.id}>
                            <a.PostImg
                              src={
                                list?.imgURL
                                  ? list.imgURL
                                  : '/assets/basicIMG.jpg'
                              }
                              onClick={() => handleBuyPostClick(list)}
                            />
                            <a.InfoBest>{list.category}</a.InfoBest>
                            <a.MyLikeDiv>{list.title}</a.MyLikeDiv>
                            <a.MyLikeDiv>
                              {list.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              P
                            </a.MyLikeDiv>
                            <p>{list.buyerNickName}</p>
                          </a.MyLikeList>
                        );
                      })
                  : null}

                {category === '구매내역'
                  ? tradeBuyData?.map((list: any) => {
                      return (
                        <a.MyLikeList key={list.id}>
                          <a.PostImg
                            src={
                              list?.imgURL
                                ? list.imgURL
                                : '/assets/basicIMG.jpg'
                            }
                            onClick={() => handleBuyPostClick(list)}
                          />
                          <a.InfoBest>{list.category}</a.InfoBest>
                          <a.MyLikeDiv>{list.title}</a.MyLikeDiv>

                          <a.MyLikeDiv>
                            {list.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            P
                          </a.MyLikeDiv>
                          <p>{list.sellerNickName}</p>
                        </a.MyLikeList>
                      );
                    })
                  : null}
                {category === '회원정보 변경' ? (
                  <a.MyInfoWrapper>
                    <MemberInfo />
                  </a.MyInfoWrapper>
                ) : null}
                {category === '포인트 관리' ? (
                  <>
                    <PointModal />
                  </>
                ) : null}
              </a.MyPageContentsWrapper>
              <a.UserProfileWrapper></a.UserProfileWrapper>
            </a.MyPageContentsContainer>
          </a.MyPageBody>
        </>
      )}
    </a.MyPageContainer>
  );
};
export default MyPage;
