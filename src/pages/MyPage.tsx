import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfileNickName, updateProfileNickName } from '../api';
import SignIn from './SignIn';
import Profile from '../components/mypage/Profile';
import PointModal from '../components/mypage/PointModal';
import styled from 'styled-components';

/**순서
 * 1. React-query 통신하기
 * 2. 닉네임 수정하기 넣기
 * 3. 로그인 여부 확인하기
 */

const MyPage = () => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const { isLoading: getLoading, data } = useQuery(
    ['users'],
    getProfileNickName
  );

  const { isLoading: editNickNameLoading, mutate: editNickNameMutate } =
    useMutation(updateProfileNickName);

  const [editNickNameValue, setEditNickNameValue] = useState(
    data?.[0]?.nickName
  );

  //닉네임 part
  const EditNickName = async (id: string) => {
    //닉네임 수정하기
    const editNickName = editNickNameValue?.trim();
    if (!editNickName) {
      setEditNickNameValue('');
      return alert('닉네임을 작성해 주세요.');
    }
    //새로운 닉네임
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

  //로그인 안 할 시 로그인 화면으로 유도
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
                  EditNickName(data?.[0]?.uid);
                }}
              >
                확인
              </CheckButton>
            </>
          ) : (
            <>
              <UserName>{data?.[0]?.nickName}</UserName>
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
          <ListWrapper>관심목록</ListWrapper>
          <ListWrapper>판매내역</ListWrapper>
          <ListWrapper>구매내역</ListWrapper>
          <ListWrapper>후기관리</ListWrapper>
        </ProfileNavWrapper>
        <UserSellBuyWrapper>
          <UserWrapper>팝니다</UserWrapper>
          <UserWrapper>삽니다</UserWrapper>
        </UserSellBuyWrapper>
        <div>내가 가진 배지</div>
        <UserBadgeWrapper>배지</UserBadgeWrapper>
        <div>찜한 목록</div>
        <UserWrapper>찜 List</UserWrapper>
        <div>후기 관리</div>
        <UserWrapper>후기 List</UserWrapper>
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

const EditInputValue = styled.input`
  text-align: center;
  width: 14rem;
  height: 28px;
  padding: 0px 12px;
  font-size: 100%;
  border: none;
  border-radius: 8px;
  :focus {
    outline: none;
  }
`;

const CheckButton = styled.button`
  width: 62px;
  height: 28px;
  font-size: 100%;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.gray30};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.gray10};
    color: ${(props) => props.theme.colors.gray30};
  }
`;

const UserName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14rem;
  height: 28px;
  font-size: 100%;
`;

const UserNameEditButton = styled.button`
  width: 62px;
  height: 28px;
  font-size: 100%;
  background-color: ${(props) => props.theme.colors.gray30};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.gray10};
    color: ${(props) => props.theme.colors.gray30};
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

const UserBadgeWrapper = styled.div`
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

const UserSellBuyWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const UserWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
`;

const ProfileNavWrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const ListWrapper = styled.button`
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
