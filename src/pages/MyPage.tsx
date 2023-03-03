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

const MyPage = () => {
  const [category, setCategory] = useState('likelist');
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
   */
  const isDoneTradeBuyList = tradeBuyData?.filter((post: any) => {
    return post.isDone == true;
  });
  console.log('isDoneTradeList', isDoneTradeBuyList);

  const isDoneTradeSellList = tradeSellData?.filter((post: any) => {
    return post.isDone == true;
  });
  console.log('isDoneTradeList', isDoneTradeSellList);

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
    color: `#656565`,
    borderBottom: `2px solid #666666`,
  };

  return (
    <a.MyPageContainer>
      <a.UserProfileWrapper>
        <ProfileImg />
        <UserName />
        <PointModal />
        <UserTime />
        <span>내가 가진 배지</span>
        <a.UserBadge>배지</a.UserBadge>
        <div>
          <span>조회수/리뷰 Chart</span>
          <Chart />
        </div>
      </a.UserProfileWrapper>
      <a.UserPostWrapper>
        <a.ProfileNavWrapper>
          <button
            onClick={() => setCategory('likelist')}
            style={category === 'likelist' ? categoryStyle : undefined}
            aria-label="관심목록"
          >
            관심목록
          </button>
          <button
            onClick={() => setCategory('selllist')}
            style={category === 'selllist' ? categoryStyle : undefined}
            aria-label="판매내역"
          >
            판매내역
          </button>
          <button
            onClick={() => setCategory('buylist')}
            style={category === 'buylist' ? categoryStyle : undefined}
            aria-label="구매내역"
          >
            구매내역
          </button>
          <button
            onClick={() => setCategory('commentlist')}
            style={category === 'commentlist' ? categoryStyle : undefined}
            aria-label="후기관리"
          >
            후기관리
          </button>
        </a.ProfileNavWrapper>
        <a.CategoryListWrapper>
          {category === 'likelist'
            ? myLikePostList?.map((list: any) => {
                return (
                  <a.UserSellBuyWrapper key={list.id}>
                    <div>{list.title}</div>
                  </a.UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'selllist'
            ? tradeSellData?.map((list: any) => {
                return (
                  <a.UserSellBuyWrapper key={list.id}>
                    <div>{list.title}</div>
                  </a.UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'buylist'
            ? tradeBuyData?.map((list: any) => {
                return (
                  <a.UserSellBuyWrapper key={list.id}>
                    <div>{list.title}</div>
                  </a.UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'commentlist'
            ? writeMyCommentsData?.map((list: any) => {
                return (
                  <a.UserBadge key={list.id}>
                    <div>{list.content}</div>
                  </a.UserBadge>
                );
              })
            : null}
        </a.CategoryListWrapper>
      </a.UserPostWrapper>
    </a.MyPageContainer>
  );
};
export default MyPage;
