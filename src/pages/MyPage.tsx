import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProfileNickName,
  getTradePoint,
  updateProfileNickName,
} from '../api';
import { useNavigate, useParams } from 'react-router-dom';
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
  console.log('saveUser: ', saveUser);
  const [category, setCategory] = useState('likelist');
  console.log('auth.currentUser?.uid: ', auth.currentUser?.uid);

  // 로그인한 유저 정보를 받아옵니다.
  const {
    isLoading: getLoading,
    isError,
    data,
    error,
  } = useQuery(['users'], getProfileNickName);

  // 거래 목록을 받아옵니다.
  const {
    isLoading: getTradeListLoading,
    isError: getTradeListIsError,
    data: tradeData,
    error: getTradeListError,
  } = useQuery(['onSalePosts'], getTradePoint);

  // 거래 완료 목록을 받아옵니다.
  const isDoneTradeList =
    tradeData?.data &&
    tradeData.data.filter((post: any) => {
      return post.isDone === true;
    });

  const { isLoading: editNickNameLoading, mutate: editNickNameMutate } =
    useMutation(updateProfileNickName);

  const [editNickNameValue, setEditNickNameValue] = useState('');

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
          <UserTime>
            <p>연락가능한 시간 : </p>
            <input type="time" />
          </UserTime>
        </UserTimeWrapper>
        <UserRatingWrapper>내가 가진 배지</UserRatingWrapper>
        <UserbadgeWrapper>배지</UserbadgeWrapper>
      </UserProfileWrapper>
      <UserPostWrapper>
        <ProfileNavWrapper>
          <LikeListBar
            onClick={() => setCategory('likelist')}
            style={category === 'likelist' ? categoryStyle : undefined}
          >
            관심목록
          </LikeListBar>
          <SellListBar
            onClick={() => setCategory('selllist')}
            style={category === 'selllist' ? categoryStyle : undefined}
          >
            판매내역
          </SellListBar>
          <BuyListBar
            onClick={() => setCategory('buylist')}
            style={category === 'buylist' ? categoryStyle : undefined}
          >
            구매내역
          </BuyListBar>
          <CommentsListBar
            onClick={() => setCategory('commentlist')}
            style={category === 'commentlist' ? categoryStyle : undefined}
          >
            후기관리
          </CommentsListBar>
        </ProfileNavWrapper>
        <CategoryListWrapper>
          {category === 'likelist'
            ? sellTradeList?.map((list: any) => {
                return (
                  <UserSellBuyWrapper key={list.id}>
                    <UserSellWrapper>팝니다</UserSellWrapper>
                  </UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'selllist'
            ? sellTradeList?.map((list: any) => {
                return (
                  <UserSellBuyWrapper key={list.id}>
                    <UserSellWrapper>팝니다</UserSellWrapper>
                  </UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'buylist'
            ? buyTradeList?.map((list: any) => {
                return (
                  <UserSellBuyWrapper key={list.id}>
                    <UserBuyWrapper>삽니다</UserBuyWrapper>
                  </UserSellBuyWrapper>
                );
              })
            : null}
          {category === 'commentlist'
            ? sellTradeList?.map((list: any) => {
                return <CommentsList key={list.id}>후기 List</CommentsList>;
              })
            : null}

          <UserLikeWrapper>찜 List</UserLikeWrapper>
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
const EditInputValue = styled.input`
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

const UserbadgeWrapper = styled.div`
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
`;
const ProfileNavWrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
`;

const CategoryListWrapper = styled.div`
  padding: 12px;
  width: 100%;
  margin-bottom: 2rem;
`;
const LikeListBar = styled.button`
  width: 8rem;
  height: 32px;
  font-size: 100%;
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray20};
  border: none;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray10};
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
