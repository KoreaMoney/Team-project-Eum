import styled from 'styled-components';
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
    <MyPageContainer>
      <UserProfileWrapper>
        <Profile />
        <UserNameWrapper>
          {isEdit ? (
            <>
              <EditInputValue
                onChange={(e) => {
                  setEditNickNameValue(e.target.value);
                }}
                type="text"
                value={editNickNameValue}
                autoFocus={true}
                placeholder="닉네임을 입력해주세요."
                maxLength={12}
              />
              <ButtonWrapper
                onClick={() => {
                  EditNickName(data?.[0]?.uid);
                }}
              >
                확인
              </ButtonWrapper>
            </>
          ) : (
            <>
              <UserName>{data?.[0]?.nickName}</UserName>
              <ButtonWrapper
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                수정
              </ButtonWrapper>
            </>
          )}
        </UserNameWrapper>
        <PointModal />
        <UserTimeWrapper>
          <UserTime>
            <p>연락가능한 시간 : </p>
            <input type="time" />
          </UserTime>
        </UserTimeWrapper>
        <UserRatingWrapper>내가 가진 배지</UserRatingWrapper>
        <UserDivWrapper>배지</UserDivWrapper>
      </UserProfileWrapper>
      <UserPostWrapper>
        <ProfileNavWrapper>
          <BarWrapper
            onClick={() => setCategory('likelist')}
            style={category === 'likelist' ? categoryStyle : undefined}
          >
            관심목록
          </BarWrapper>
          <BarWrapper
            onClick={() => setCategory('selllist')}
            style={category === 'selllist' ? categoryStyle : undefined}
          >
            판매내역
          </BarWrapper>
          <BarWrapper
            onClick={() => setCategory('buylist')}
            style={category === 'buylist' ? categoryStyle : undefined}
          >
            구매내역
          </BarWrapper>
          <BarWrapper
            onClick={() => setCategory('commentlist')}
            style={category === 'commentlist' ? categoryStyle : undefined}
          >
            후기관리
          </BarWrapper>
        </ProfileNavWrapper>
        <CategoryListWrapper>
          {category === 'likelist'
            ? sellTradeList?.map((list: any) => {
                return (
                  <UserSellBuyWrapper key={list.id}>
                    <UserWrapper>팝니다</UserWrapper>
                  </UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'selllist'
            ? sellTradeList?.map((list: any) => {
                return (
                  <UserSellBuyWrapper key={list.id}>
                    <UserWrapper>팝니다</UserWrapper>
                  </UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'buylist'
            ? buyTradeList?.map((list: any) => {
                return (
                  <UserSellBuyWrapper key={list.id}>
                    <UserWrapper>삽니다</UserWrapper>
                  </UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'commentlist'
            ? sellTradeList?.map((list: any) => {
                return <UserDivWrapper key={list.id}>후기 List</UserDivWrapper>;
              })
            : null}
          <UserDivWrapper>찜 List</UserDivWrapper>
        </CategoryListWrapper>
      </UserPostWrapper>
    </MyPageContainer>
  );
};
export default MyPage;

const MyPageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 40px;
  width: 100%;
`;

const UserProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rem;
`;

const UserPostWrapper = styled.div`
  width: 72rem;
`;

const UserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 62px;
  margin: 10px auto 30px auto;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray20};
`;
const UserName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14rem;
  height: 28px;
  font-size: 100%;
`;
const ButtonWrapper = styled.button`
  width: 62px;
  height: 28px;
  font-size: 100%;
  background-color: ${(props) => props.theme.colors.gray30};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.gray20};
    color: ${(props) => props.theme.colors.gray30};
  }
`;

const EditInputValue = styled.input`
  width: 14rem;
  height: 28px;
  font-size: 100%;
  border: none;
  border-radius: 8px;
  padding: 0px 12px;
  text-align: center;
  :focus {
    outline: none;
  }
`;

const UserTimeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  width: 18rem;
`;

const UserTime = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const UserRatingWrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 2rem;
  width: 18rem;
`;

const UserSellBuyWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const UserDivWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  width: 18rem;
  height: 6rem;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  margin-bottom: 24px;
`;

const UserWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  width: 50%;
  height: 320px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
`;

const ProfileNavWrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: left;
  align-items: center;
`;
const CategoryListWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  width: 100%;
  height: 50rem;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  margin-bottom: 24px;
`;

const BarWrapper = styled.button`
  width: 8rem;
  height: 32px;
  font-size: 100%;
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray20};
  border: none;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray10};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.gray30};
    border-bottom: 2px solid ${(props) => props.theme.colors.gray30};
  }
`;
