import styled from 'styled-components';
import { useState } from 'react';
import Profile from '../components/mypage/Profile';
import { auth } from '../firebase/Firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileNickName, updateProfileNickName } from '../api';
import { useNavigate } from 'react-router-dom';
import SignIn from './SignIn';
import PointModal from '../components/mypage/PointModal';

const MyPage = () => {
  const queryClient = useQueryClient();

  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const {
    isLoading: getLoading,
    isError,
    data,
    error,
  } = useQuery(['users'], getProfileNickName);

  const { isLoading: editNickNameLoading, mutate: editNickNameMutate } =
    useMutation(updateProfileNickName);

  const currentUser =
    data?.data &&
    data.data.filter((user: any) => {
      return auth.currentUser?.uid === user.id;
    });

  const [editNickNameValue, setEditNickNameValue] = useState(
    currentUser?.[0]?.nickName
  );

  const EditNickName = async (id: string) => {
    const editNickName = editNickNameValue?.trim();
    if (!editNickName) {
      setEditNickNameValue('');
      return alert('닉네임을 작성해 주세요.');
    }
    const newNickName = {
      id: currentUser?.[0]?.id,
      nickName: editNickNameValue,
    };
    await editNickNameMutate(newNickName, {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    });
    setIsEdit(false);
  };

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  if (!saveUser) {
    return <SignIn />;
  }

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
              <CheckButton
                onClick={() => {
                  EditNickName(currentUser?.[0]?.id);
                }}
              >
                확인
              </CheckButton>
            </>
          ) : (
            <>
              <UserName>{currentUser?.[0]?.nickName}</UserName>
              <UserNameEditButton
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                수정
              </UserNameEditButton>
            </>
          )}
        </UserNameWrapper>
        <PointModal />
        <UserTimeWrapper>
          <UserTime>연락가능한 시간 : 09:00 - 21:00</UserTime>
        </UserTimeWrapper>
        <UserRatingWrapper>등급표시</UserRatingWrapper>
      </UserProfileWrapper>
      <UserPostWrapper>
        <ProfileNavWrapper>
          <LikeListBar>관심목록</LikeListBar>
          <SellListBar>판매내역</SellListBar>
          <BuyListBar>구매내역</BuyListBar>
          <CommentsListBar>후기관리</CommentsListBar>
        </ProfileNavWrapper>
        <UserSellBuyWrapper>
          <UserSellWrapper>팝니다</UserSellWrapper>
          <UserBuyWrapper>삽니다</UserBuyWrapper>
        </UserSellBuyWrapper>
        <div>내가 가진 배지</div>
        <UserbadgeWrapper>배지</UserbadgeWrapper>
        <div>찜한 목록</div>
        <UserLikeWrapper>찜 List</UserLikeWrapper>
        <div>후기 관리</div>
        <CommentsList>후기 List</CommentsList>
      </UserPostWrapper>
    </MyPageContainer>
  );
};

export default MyPage;

const MyPageContainer = styled.div`
  padding: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const UserProfileWrapper = styled.div`
  width: 24rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserPostWrapper = styled.div`
  width: 72rem;
`;

const UserNameWrapper = styled.div`
  padding-left: 62px;
  margin: 10px auto 30px auto;
  border-bottom: 2px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserName = styled.div`
  width: 14rem;
  height: 28px;
  font-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserNameEditButton = styled.button`
  width: 62px;
  height: 28px;
  font-size: 100%;
  background-color: #656565;
  color: #fff;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const CheckButton = styled.button`
  width: 62px;
  height: 28px;
  font-size: 100%;
  background-color: #656565;
  color: #fff;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
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
  margin-bottom: 2rem;
  width: 18rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserTime = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserRatingWrapper = styled.div`
  margin-bottom: 2rem;
  width: 18rem;
  display: flex;
  justify-content: left;
  align-items: center;
`;

const UserSellBuyWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const UserSellWrapper = styled.div`
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const UserBuyWrapper = styled.div`
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const UserbadgeWrapper = styled.div`
  padding: 12px;
  width: 100%;
  height: 80px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 24px;
`;

const UserLikeWrapper = styled.div`
  padding: 12px;
  width: 100%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 24px;
`;

const CommentsList = styled.div`
  padding: 12px;
  width: 100%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileNavWrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: left;
  align-items: center;
`;

const LikeListBar = styled.button`
  width: 8rem;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #cccccc;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;

const SellListBar = styled.button`
  width: 8rem;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #cccccc;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;

const BuyListBar = styled.button`
  width: 8rem;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #cccccc;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;

const CommentsListBar = styled.button`
  width: 8rem;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #cccccc;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;
