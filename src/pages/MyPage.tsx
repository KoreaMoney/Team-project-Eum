import { useState } from 'react';
import ProfileImg from '../components/mypage/ProfileImg';
import { useQuery } from '@tanstack/react-query';
import {
  getOnSalePostBuyer,
  getOnSalePostSeller,
  getWriteMyComments,
  getPosts,
} from '../api';
import SignIn from './SignIn';
import PointModal from '../components/mypage/PointModal';
import * as a from '../styles/styledComponent/myPage';
import Chart from '../components/mypage/Chart';
import UserTime from '../components/mypage/UserTime';
import UserName from '../components/mypage/UserName';
import { theme } from '../styles/theme';

const MyPage = () => {
  const [category, setCategory] = useState('관심목록');
  const [sellCategory, setSellCategory] = useState('판매중');
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  /* 거래 목록을 받아옵니다.
   * 1. 전체 거래 목록을 받아옵니다.
   * 2. 유저가 찜 한 목록을 받아옵니다.
   */
  const {
    isLoading: getPostListLoading,
    isError: getPostListIsError,
    data: postData,
  } = useQuery(['Posts'], () => getPosts());
  console.log('postData', postData);

  const myLikePostList = postData?.filter((post: any) => {
    return post.like == saveUser.uid;
  });
  console.log('myLikePostList', myLikePostList);

  /* 내 거래 목록을 받아옵니다.
   * 1. 구매 목록을 받아옵니다.
   * 2. 판매 목록을 받아옵니다.
   */
  const {
    isLoading: getTradeBuyListLoading,
    isError: getTradeBuyListIsError,
    data: tradeBuyData,
  } = useQuery(['onSaleBuyPosts', saveUser.uid], () =>
    getOnSalePostBuyer(saveUser.uid)
  );
  console.log('tradeBuyData', tradeBuyData);

  const {
    isLoading: getTradeSellListLoading,
    isError: getTradeSellListIsError,
    data: tradeSellData,
  } = useQuery(['onSaleSellPosts', saveUser.uid], () =>
    getOnSalePostSeller(saveUser.uid)
  );
  console.log('tradeSellData', tradeSellData);

  /* 내 거래 완료 목록을 받아옵니다.
   * 1. 구매 완료 목록을 받아옵니다.
   * 2. 판매 완료 목록을 받아옵니다.
   * 3. 판매 대기 목록을 받아옵니다.
   */
  const isDoneTradeBuyList = tradeBuyData?.filter((post: any) => {
    return post.isDone == true;
  });
  console.log('isDoneTradeList', isDoneTradeBuyList);

  const isDoneTradeSellList = tradeSellData?.filter((post: any) => {
    return post.isDone == true;
  });
  console.log('isDoneTradeList', isDoneTradeSellList);

  const waitTradeSellList = tradeSellData?.filter((post: any) => {
    return post.isDone == false;
  });
  console.log('waitTradeSellList', waitTradeSellList);

  // 내 작성 후기 목록을 받아옵니다.
  const {
    isLoading: getMyCommentListLoading,
    isError: getMyCommentListIsError,
    data: writeMyCommentsData,
  } = useQuery(['writeMyComments', saveUser.uid], () =>
    getWriteMyComments(saveUser.uid)
  );
  console.log('writeMyCommentsData', writeMyCommentsData);

  if (!saveUser) {
    return <SignIn />;
  }

  // 마이페이지 Nav 클릭시 Nav 이미지
  const categoryStyle = {
    fontSize: `${theme.fontSize.title20}`,
    fontWeight: `${theme.fontWeight.medium}`,
    color: `${theme.colors.orange01}`,
  };

  const mySellNavStyle = {
    fontSize: `${theme.fontSize.title20}`,
    fontWeight: `${theme.fontWeight.medium}`,
    color: `${theme.colors.gray60}`,
    borderBottom: `3px solid ${theme.colors.gray40}`,
  };

  return (
    <a.MyPageContainer>
      <a.MyPageHeader>마이페이지</a.MyPageHeader>
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
              style={category === '나의 판매내역' ? categoryStyle : undefined}
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
            <div
              onClick={() => setCategory('후기관리')}
              style={category === '후기관리' ? categoryStyle : undefined}
              aria-label="후기관리"
            >
              후기관리
            </div>
          </a.MyTradeNavWrapper>
          <a.MyInfoNavWrapper>
            <span>회원 정보</span>
            <div
              onClick={() => setCategory('회원정보 변경')}
              style={category === '회원정보 변경' ? categoryStyle : undefined}
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
          <p>{category}</p>
          {category === '나의 판매내역' ? (
            <a.MySellNav>
              <div
                onClick={() => setSellCategory('판매중')}
                style={sellCategory === '판매중' ? mySellNavStyle : undefined}
                aria-label="판매중"
              >
                판매중
              </div>
              <div
                onClick={() => setSellCategory('거래완료')}
                style={sellCategory === '거래완료' ? mySellNavStyle : undefined}
                aria-label="거래완료"
              >
                거래완료
              </div>
            </a.MySellNav>
          ) : null}
          <a.MyPageContentsWrapper>
            {category === '관심목록'
              ? myLikePostList?.map((list: any) => {
                  return (
                    <a.MyLikeList key={list.id}>
                      <a.LikeImg
                        src="/assets/like.png"
                        alt="찜"
                        loading="lazy"
                      />
                      <a.PostImg src={list.imgURL} />
                      <a.MyLikeDiv>{list.category}</a.MyLikeDiv>
                      <a.MyLikeDiv>{list.title}</a.MyLikeDiv>
                      <a.MyLikeDiv>{list.price} P</a.MyLikeDiv>
                      <a.MyLikeDiv>{list.nickName}</a.MyLikeDiv>
                    </a.MyLikeList>
                  );
                })
              : null}
            {sellCategory === '판매중'
              ? waitTradeSellList?.map((list: any) => {
                  return (
                    <a.UserSellBuyWrapper key={list.id}>
                      <img src={list.imgURL} />
                      <div>{list.title}</div>
                      <div>{list.price}</div>
                      <div>{list.like.length}</div>
                    </a.UserSellBuyWrapper>
                  );
                })
              : isDoneTradeSellList?.map((list: any) => {
                  return (
                    <a.UserSellBuyWrapper key={list.id}>
                      <img src={list.imgURL} />
                      <div>{list.title}</div>
                      <div>{list.price}</div>
                      <div>{list.like.length}</div>
                    </a.UserSellBuyWrapper>
                  );
                })}
            {category === '구매내역'
              ? tradeBuyData?.map((list: any) => {
                  return (
                    <a.UserSellBuyWrapper key={list.id}>
                      <img src={list.imgURL} />
                      <div>{list.title}</div>
                      <div>{list.price}</div>
                      <div>{list.like.length}</div>
                    </a.UserSellBuyWrapper>
                  );
                })
              : null}
            {category === '후기관리'
              ? writeMyCommentsData?.map((list: any) => {
                  return (
                    <a.UserBadge key={list.id}>
                      <div>{list.content}</div>
                    </a.UserBadge>
                  );
                })
              : null}
            {category === '회원정보 변경' ? (
              <>
                <ProfileImg />
                <UserName />
                <UserTime />
                <span>내가 가진 배지</span>
                <a.UserBadge>배지</a.UserBadge>
                <div>
                  <span>조회수/리뷰 Chart</span>
                  <Chart />
                </div>
              </>
            ) : null}
            {category === '포인트 관리' ? (
              <>
                <PointModal />
                <div>
                  <span>조회수/리뷰 Chart</span>
                  <Chart />
                </div>
              </>
            ) : null}
          </a.MyPageContentsWrapper>
          <a.UserProfileWrapper></a.UserProfileWrapper>
        </a.MyPageContentsContainer>
      </a.MyPageBody>
    </a.MyPageContainer>
  );
};
export default MyPage;
