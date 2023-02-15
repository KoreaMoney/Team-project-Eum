import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const Detail = () => {
  return (
    <DetailContainer>
      <PostContainer>
        <PostImage>사진 혹은 영상</PostImage>
        <PostInfoWrapper>
          <SellBuyWrapper>
            <SellButton>팝니다</SellButton>
            <BuyButton>삽니다</BuyButton>
          </SellBuyWrapper>
          <PostTitle>제목</PostTitle>
          <PostPrice>가격</PostPrice>
          <PostLikeButton>찜하기</PostLikeButton>
          <OrderButton>바로 신청하기</OrderButton>
        </PostInfoWrapper>
      </PostContainer>
      <PostContentWrapper>
        <PostContent>서비스 설명</PostContent>
        <PostUserInfo>작성자 정보</PostUserInfo>
      </PostContentWrapper>
      <CommentsWrapper>
        <div>후기</div>
      </CommentsWrapper>
    </DetailContainer>
  );
};

export default Detail;

const DetailContainer = styled.div`
  padding: 40px;
  width: 100%;
`;

const PostContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const PostImage = styled.div`
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostInfoWrapper = styled.div`
  width: 50%;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SellBuyWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SellButton = styled.button`
  width: 50%;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #656565;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;

const BuyButton = styled.button`
  width: 50%;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #656565;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;

const PostTitle = styled.div`
  width: 100%;
  height: 48px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostPrice = styled.div`
  width: 100%;
  height: 48px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostLikeButton = styled.button`
  width: 100px;
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

const OrderButton = styled.button`
  width: 100%;
  height: 48px;
  font-size: 100%;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const PostContentWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const PostContent = styled.div`
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostUserInfo = styled.div`
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CommentsWrapper = styled.div`
  padding: 12px;
  width: 100%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 24px;
`;
