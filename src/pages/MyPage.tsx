import styled from 'styled-components';
import { useState } from 'react';
import Profile from '../components/mypage/Profile';
import { auth } from '../firebase/Firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPostList,
  getProfileNickName,
  getTradePoint,
  updateProfileNickName,
} from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import SignIn from './SignIn';
import PointModal from '../components/mypage/PointModal';
import { editPostType } from '../types';
import axios from 'axios';

const MyPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [category, setCategory] = useState('likelist');
  const navigate = useNavigate();

  // 유저의 정보를 받아옵니다.
  const {
    isLoading: getLoading,
    isError,
    data,
    error,
  } = useQuery(['users'], getProfileNickName);

  // 거래 정보를 받아옵니다.
  const {
    isLoading: getTradeListLoading,
    isError: getTradeListIsError,
    data: tradeData,
    error: getTradeListError,
  } = useQuery(['onSalePosts'], getTradePoint);

  // 게시글 정보를 받아옵니다.
  const {
    isLoading: getPostListLoading,
    isError: getPostListIsError,
    data: postData,
    error: getPostListError,
  } = useQuery(['posts'], getPostList);

  // 관심 목록을 나타냅니다.
  const isLikePostList =
    postData?.data &&
    postData.data.filter((post: any) => {
      return auth.currentUser?.uid === post.id;
    });

  // 완료된 거래목록을 나타냅니다.
  const isDoneTradeList =
    tradeData?.data &&
    tradeData.data.filter((post: any) => {
      return post.isDone === true;
    });

  // 로그인한 유저가 판매한 목록을 나타냅니다.
  const sellTradeList = isDoneTradeList?.filter((user: any) => {
    return auth?.currentUser?.uid === user?.sellerUid;
  });

  // 로그인한 유저가 구매한 목록을 나타냅니다.
  const buyTradeList = isDoneTradeList?.filter((user: any) => {
    return auth?.currentUser?.uid === user?.buyerUid;
  });

  // 닉네임을 수정하도록 접근합니다.
  const { isLoading: editNickNameLoading, mutate: editNickNameMutate } =
    useMutation(updateProfileNickName);

  // 파이어베이스 auth와 db.json을 비교해 동일 id를 찾습니다.
  const currentUser =
    data?.data &&
    data.data.filter((user: any) => {
      return auth.currentUser?.uid === user.id;
    });

  // 수정할 닉네임을 저장하며, 초기값으로 db.json에 저장된 닉네임을 받아옵니다.
  const [editNickNameValue, setEditNickNameValue] = useState(
    currentUser?.[0]?.nickName
  );

  // 닉네임을 수정합니다.
  const EditNickName = async (id: any) => {
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
                    <UserLikeWrapper>찜 List</UserLikeWrapper>
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
        </CategoryListWrapper>
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
  width: 100%;
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

const UserbadgeWrapper = styled.div`
  padding: 12px;
  width: 18rem;
  height: 6rem;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
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

const CategoryListWrapper = styled.div`
  padding: 12px;
  width: 100%;
  height: 50rem;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 24px;
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
