import styled from 'styled-components';
import React, { useCallback, useEffect, useState } from 'react';
import { CustomModal } from '../components/modal/CustomModal';
import Profile from '../components/mypage/Profile';
import { auth } from '../firebase/Firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileNickName, updateProfileNickName } from '../api';
import { useRecoilState } from 'recoil';
import { loginUserCheckState } from '../atom';
import { useNavigate } from 'react-router-dom';
import SignIn from './SignIn';

const MyPage = () => {
  const queryClient = useQueryClient();

  const [isEdit, setIsEdit] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const navigate = useNavigate();

  const {
    isLoading: getLoading,
    isError,
    data,
    error,
  } = useQuery(['users'], getProfileNickName);

  const { isLoading: editNickNameLoading, mutate: editNickNameMutate } =
    useMutation(updateProfileNickName);

  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

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
      return <SignIn />
    }


  return (
    <MyPageContainer>
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
              placeholder="수정할 닉네임을 입력해주세요."
              maxLength={16}
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
      <PointButton onClick={onClickToggleModal}>포인트</PointButton>
      {isModalActive ? (
        <CustomModal
          modal={isModalActive}
          setModal={setIsModalActive}
          width="800"
          height="800"
          element={
            <PointModalContainer>
              <CloseButton onClick={onClickToggleModal}>X</CloseButton>

              <PointImgWrapper>
                <img src="/assets/walletmoney.png" />
                <h3>　내 포인트</h3>
              </PointImgWrapper>
              <CurrentPoint>3,500,000P</CurrentPoint>
              <PointDepositWithdrawWrapper>
                <PointDepositButton>
                  <img src="/assets/moneysend.png" />
                  <h3>　충전하기</h3>
                </PointDepositButton>
                <PointWithdrawButton>
                  <img src="/assets/emptywalletadd.png" />
                  <h3>　출금하기</h3>
                </PointWithdrawButton>
              </PointDepositWithdrawWrapper>
              <PointHistoryContainer>
                <h3>　전체</h3>
                <PointHistoryWrapper>
                  <PointHistory>
                    <PointHistoryDate>2.14</PointHistoryDate>
                    <PointHistoryContent>
                      인스타그램 친구추가
                    </PointHistoryContent>
                    <PointHistoryAmount>200P</PointHistoryAmount>
                  </PointHistory>
                  <PointHistory>
                    <PointHistoryDate>2.12</PointHistoryDate>
                    <PointHistoryContent>수학문제 풀이</PointHistoryContent>
                    <PointHistoryAmount>300P</PointHistoryAmount>
                  </PointHistory>
                </PointHistoryWrapper>
              </PointHistoryContainer>
            </PointModalContainer>
          }
        />
      ) : (
        ''
      )}
      <UserTimeWrapper>
        <div>연락가능한 시간 : 09:00 - 21:00</div>
      </UserTimeWrapper>
      <UserRatingWrapper>등급표시</UserRatingWrapper>
      <div>내가 쓴 글</div>
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
    </MyPageContainer>
  );
};

export default MyPage;

const MyPageContainer = styled.div`
  padding: 40px;
  width: 100%;
`;

const UserNameWrapper = styled.div`
  padding-left: 62px;
  width: 32%;
  margin: 10px auto;
  border-bottom: 2px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserName = styled.div`
  width: 100%;
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
  width: 100%;
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

const PointButton = styled.button`
  margin-left: 68%;
  width: 180px;
  height: 72px;
  font-size: 100%;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  position: absolute;
  top: 236px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const PointModalContainer = styled.div`
  width: 800px;
  height: 800px;
  padding: 10%;
  color: black;
`;

const PointImgWrapper = styled.div`
  margin-bottom: 12px;
  width: 100%;
  font-size: 100%;
  display: flex;
  align-items: center;
`;

const CurrentPoint = styled.div`
  margin-bottom: 24px;
  padding: 12px 40px;
  width: 100%;
  height: 80px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

const PointDepositWithdrawWrapper = styled.div`
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

const PointDepositButton = styled.button`
  width: 50%;
  height: 72px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const PointWithdrawButton = styled.button`
  width: 50%;
  height: 72px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const PointHistoryContainer = styled.div``;

const PointHistoryWrapper = styled.div`
  margin: 12px 0;
  padding: 12px 24px;
  width: 100%;
  height: 360px;
  background-color: #d9d9d9;
  color: #737373;
  border-radius: 10px;
  margin-bottom: 24px;
`;

const PointHistory = styled.div`
  margin: 12px 0;
  width: 100%;
  height: 1.5rem;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #737373;
`;

const PointHistoryDate = styled.p`
  width: 20%;
`;
const PointHistoryContent = styled.p`
  width: 65%;
`;
const PointHistoryAmount = styled.p`
  width: 15%;
`;

const CloseButton = styled.button`
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  width: 40px;
  height: 40px;
  right: 12px;
  top: 12px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const UserTimeWrapper = styled.div`
  margin: 12px auto;
  width: 68%;
  display: flex;
  justify-content: right;
  align-items: center;
`;

const UserRatingWrapper = styled.div`
  margin: 12px auto;
  width: 68%;
  display: flex;
  justify-content: left;
  align-items: center;
`;

const UserSellBuyWrapper = styled.div`
  height: 100%;
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
