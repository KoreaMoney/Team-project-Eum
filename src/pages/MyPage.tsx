import styled from 'styled-components';
import React from 'react';

const MyPage = () => {
  return (
    <MyPageContainer>
      <MyImageWrapper>
        <div>프로필 이미지</div>
      </MyImageWrapper>
      <UserNameWrapper>
        <div>닉네임</div>
        <UserNameEditButton>수정버튼</UserNameEditButton>
      </UserNameWrapper>
      <PointButton>포인트</PointButton>
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

const MyImageWrapper = styled.div`
  background-color: lightgray;
  margin: 20px auto;
  width: 200px;
  height: 200px;
  border: 2px solid lightgray;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const UserNameWrapper = styled.div`
  width: 32%;
  margin: 10px auto;
  border-bottom: 2px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserNameEditButton = styled.button`
  margin-left: 40%;
  width: 80px;
  height: 32px;
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

const PointButton = styled.button`
  margin-left: 68%;
  width: 180px;
  height: 72px;
  font-size: 100%;
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
