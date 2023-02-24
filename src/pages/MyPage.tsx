import { useState } from 'react';
import Profile from '../components/mypage/Profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProfileNickName,
  getTradePoint,
  updateProfileNickName,
} from '../api';
import SignIn from './SignIn';
import PointModal from '../components/mypage/PointModal';
import * as a from '../styles/styledComponent/myPage';

const MyPage = () => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [category, setCategory] = useState('likelist');
  const [editNickNameValue, setEditNickNameValue] = useState('');
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  // 로그인한 유저 정보를 받아옵니다.
  const { isLoading: getLoading, data } = useQuery(
    ['users'],
    getProfileNickName
  );

  // 거래 목록을 받아옵니다.
  const {
    isLoading: getTradeListLoading,
    isError: getTradeListIsError,
    data: tradeData,
  } = useQuery(['onSalePosts'], getTradePoint);

  // 거래 완료 목록을 받아옵니다.
  const isDoneTradeList =
    tradeData?.data &&
    tradeData.data.filter((post: any) => {
      return post.isDone === true;
    });

  const { isLoading: editNickNameLoading, mutate: editNickNameMutate } =
    useMutation(updateProfileNickName);

  // 로그인한 유저의 판매 목록을 출력합니다.
  const sellTradeList = isDoneTradeList?.filter((user: any) => {
    return saveUser.uid === user?.sellerUid;
  });

  // 로그인한 유저의 구매 목록을 출력합니다.
  const buyTradeList = isDoneTradeList?.filter((user: any) => {
    return saveUser.uid === user?.buyerUid;
  });

  // 닉네임을 수정합니다.
  const EditNickName = async (id: string) => {
    const editNickName = editNickNameValue?.trim();
    if (!editNickName) {
      setEditNickNameValue('');
      return alert('닉네임을 작성해 주세요.');
    }
    const newNickName = {
      id: data?.[0]?.id,
      nickName: editNickNameValue,
    };
    await editNickNameMutate(newNickName, {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    });
    setIsEdit(false);
  };
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
        <Profile />
        <a.UserNameWrapper>
          {isEdit ? (
            <>
              <a.EditInputValue
                onChange={(e) => {
                  setEditNickNameValue(e.target.value);
                }}
                type="text"
                value={editNickNameValue}
                autoFocus={true}
                placeholder="닉네임을 입력해주세요."
                maxLength={12}
              />
              <button
                onClick={() => {
                  EditNickName(data?.[0]?.uid);
                }}
                aria-label="확인"
              >
                확인
              </button>
            </>
          ) : (
            <>
              <div>{data?.[0]?.nickName}</div>
              <button
                onClick={() => {
                  setIsEdit(true);
                }}
                aria-label="수정"
              >
                수정
              </button>
            </>
          )}
        </a.UserNameWrapper>
        <PointModal />
        <a.MyPageTimeWrapper>
          <div>
            <p>연락가능한 시간 : </p>
            <input type="time" />
          </div>
        </a.MyPageTimeWrapper>
        <span>내가 가진 배지</span>
        <a.UserBadge>배지</a.UserBadge>
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
            ? sellTradeList?.map((list: any) => {
                return (
                  <a.UserSellBuyWrapper key={list.id}>
                    <div>팝니다</div>
                  </a.UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'selllist'
            ? sellTradeList?.map((list: any) => {
                return (
                  <a.UserSellBuyWrapper key={list.id}>
                    <div>팝니다</div>
                  </a.UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'buylist'
            ? buyTradeList?.map((list: any) => {
                return (
                  <a.UserSellBuyWrapper key={list.id}>
                    <div>삽니다</div>
                  </a.UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'commentlist'
            ? sellTradeList?.map((list: any) => {
                return <a.UserBadge key={list.id}>후기 List</a.UserBadge>;
              })
            : null}
          <a.UserBadge>찜 List</a.UserBadge>
        </a.CategoryListWrapper>
      </a.UserPostWrapper>
    </a.MyPageContainer>
  );
};
export default MyPage;
