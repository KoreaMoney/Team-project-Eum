import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import CommentInput from '../components/comment/CommentInput';
import CommentsList from '../components/comment/CommentsList';
import basicIMG from '../styles/basicIMG.png';
import { AiFillLike, AiFillHeart } from 'react-icons/ai';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import { auth } from '../firebase/Firebase';
import { onSalePostType, userType } from '../types';
import parse from 'html-react-parser';
const Detail = () => {
  const { id } = useParams();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const location = useLocation();
  // 클릭한 글의 데이터를 가지고 옵니다.
  const { data: post, isLoading } = useQuery(['post', id], async () => {
    // 쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
    const response = await axios.get(`http://localhost:4000/posts?id=${id}`);
    return response.data;
  });
  console.log('post', post);
  // onSalePosts 데이터가 생성 코드
  const { mutate: onSalePosts } = useMutation((newSalePosts: onSalePostType) =>
    axios.post('http://localhost:4000/onSalePosts', newSalePosts)
  );

  // 포인트 수정을 위해 유저 정보를 가지고 옵니다.
  const { data: user } = useQuery(
    ['user', saveUser?.uid],
    async () => {
      const response = await axios.get(
        `http://localhost:4000/users/${saveUser?.uid}`
      );
      return response.data;
    },
    {
      enabled: Boolean(saveUser?.uid), // saveUser?.uid가 존재할 때만 쿼리를 시작
    }
  );
  console.log('user: ', user);

  // 판매자의 프로필이미지를 위해 데이터 가져오기
  const { data: seller } = useQuery(
    ['user', post?.[0].sellerUid],
    async () => {
      const response = await axios.get(
        `http://localhost:4000/users/${post?.[0].sellerUid}`
      );
      return response.data;
    },
    {
      enabled: Boolean(post?.[0].sellerUid), // saveUser?.uid가 존재할 때만 쿼리를 시작
    }
  );
  console.log('seller', seller);
  

  // 포인트를 수정해주는 mutation 함수
  const { mutate: updateUser } = useMutation((newUser: { point: string }) =>
    axios.patch(`http://localhost:4000/users/${saveUser?.uid}`, newUser)
  );

  if (isLoading) {
    console.log('로딩중');
    return <div>Lodding...</div>;
  }
  if (!post || post.length === 0) {
    console.log('데이터없음');
    return <div>Mo data found</div>;
  }
  // 바로 신청하기 버튼 클릭 하면
  // user 데이터의 point가 price만큼 빠지고
  // mutate로 데이터를 저장합니다.

  const onClickApplyBuy = async () => {
    // 구매자의 포인트에서 price만큼 뺀걸 구매자의 user에 업데이트
    if (saveUser) {
      await updateUser({
        point: String(Number(user.point) - Number(post?.[0].price)),
      });

      const uuid = uuidv4();
      await onSalePosts({
        id: uuid,
        postsId: id,
        buyerUid: saveUser.uid,
        sellerUid: post?.[0].sellerUid,
        title: post?.[0].title,
        content: post?.[0].content,
        imgURL: post?.[0].imgURL,
        price: post?.[0].price,
        category: post?.[0].category,
        ceatedAt: Date.now(),
        isDone: false,
        isSellerCancel: false,
        isBuyerCancel: false,
        views: post?.[0].views,
        like: post?.[0].like,
      });
      navigate(`/detail/${categoryName}/${id}/${saveUser?.uid}/${uuid}`);
    } else {
      navigate('/signin', { state: { from: location.pathname } });
    }
  };
  return (
    <DetailContainer>
      <EditDeletButtonContainer>
        {saveUser && (
          <>
            <EditDeletButton>수정</EditDeletButton>
            <EditDeletButton>삭제</EditDeletButton>
          </>
        )}
      </EditDeletButtonContainer>
      <PostContainer>
        <PostImage img={post[0].imgURL} />
        <PostInfoWrapper>
          <TitleText>{post[0].title}</TitleText>
          <PostPrice>{post[0].price} 원</PostPrice>
          <SellerText>판매자</SellerText>
          <SellerProfileContainer>
            <SellerProfileTopDiv>
              <TopLeftContainer>
                <ProfileIMG
                  profileIMG={
                    seller?.profileImg ? seller?.profileImg : basicIMG
                  }
                />
              </TopLeftContainer>
              <TopRightContainer>
                <SellerNickName>{post[0].nickName}</SellerNickName>
              </TopRightContainer>
            </SellerProfileTopDiv>
            <SellerProfileBottomDiv>
              <BottomTopContainer>
                <ContactTimeContainer>
                  <ContactTimeTitleText>연락가능시간</ContactTimeTitleText>
                  <ContactTimeContentText>
                    {post[0].contactTime
                      ? post[0].contactTime
                      : '00:00 ~ 24:00'}
                  </ContactTimeContentText>
                </ContactTimeContainer>
              </BottomTopContainer>
              <BottomBottomContainer>
                <ProfileButtonContainer>
                  <ProfileButtons>판매상품 10개</ProfileButtons>
                  <ProfileButtons>받은 후기</ProfileButtons>
                  <ProfileButtons>
                    <RightButtonContainer>
                      <LikeIcon />
                      <LikeCounter>{seller?.like?.length}</LikeCounter>
                    </RightButtonContainer>
                  </ProfileButtons>
                </ProfileButtonContainer>
              </BottomBottomContainer>
            </SellerProfileBottomDiv>
          </SellerProfileContainer>
          <LikeAndSubmitContainer>
            <PostLikeButtonContainer>
              <HeartIcon />
            </PostLikeButtonContainer>
            <OrderButton onClick={onClickApplyBuy}>바로 신청하기</OrderButton>
          </LikeAndSubmitContainer>
        </PostInfoWrapper>
      </PostContainer>
      <PostContentWrapper>
        <PostContent>
          {parse(post[0].content)}
        </PostContent>
        
      </PostContentWrapper>
      <CommentsWrapper>
        <div>
          {saveUser && <CommentInput />}
          <CommentsList />
        </div>
      </CommentsWrapper>
    </DetailContainer>
  );
};

export default Detail;
const HeartIcon = styled(AiFillHeart)`
  color: red;
`;

const LikeAndSubmitContainer = styled.div`
  display: flex;
  gap: 3rem;
`;

const LikeCounter = styled.p`
  font-size: ${(props) => props.theme.fontSize.body16};
`;
const LikeIcon = styled(AiFillLike)`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;
const BottomBottomContainer = styled.div`
  height: 50%;
`;
const ProfileButtonContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
`;
const ProfileButtons = styled.button`
  width: 100%;
  height: 64px;
  font-size: ${(props) => props.theme.fontSize.body16};
  background-color: #ffda18;
  border: none;
  &:hover {
    box-shadow: 2px 2px 4px #d5d5d5;
  }
`;
const RightButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;
const SellerText = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;
const SellerProfileContainer = styled.div`
  width: 100%;
  height: 240px;
  box-shadow: 1px 1px 5px #d1d1d1;
`;
const SellerProfileTopDiv = styled.div`
  width: 100%;
  height: 70px;
  background-color: #ffda18;
  display: flex;
`;

const TopLeftContainer = styled.div`
  width: 30%;
  position: relative;
`;
const ProfileIMG = styled.div<{ profileIMG: string }>`
  position: absolute;
  width: 100px;
  height: 100px;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;
const TopRightContainer = styled.div`
  width: 70%;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.5rem;
`;
const SellerNickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;
const SellerProfileBottomDiv = styled.div`
  width: 100%;
  height: 171px;
`;
const BottomTopContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: flex-start;
  height: 50%;
`;
const ContactTimeContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 0.7rem 1.5rem;
  gap: 0.5rem;
`;
const ContactTimeTitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;
const ContactTimeContentText = styled.span`
  font-size: ${(props) => props.theme.fontSize.label12};
  color: ${(props) => props.theme.colors.gray20};
`;
const EditDeletButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const EditDeletButton = styled.button`
  font-size: ${(props) => props.theme.fontSize.bottom20};
  width: 5rem;
  height: 2.5rem;
  border: none;
  background-color: #ffda18;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 3px #d1d1d1;
  }
`;
const DetailContainer = styled.div`
  width: 60%;
  margin: 0 auto;
`;

const PostContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4rem;
  margin-bottom: 24px;
`;

const PostImage = styled.div<{ img: string }>`
  width: 60%;
  height: 490px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
`;

const PostInfoWrapper = styled.div`
  width: 50%;
  height: 490px;
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

const BuyButton = styled.button`
  width: 50%;
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

const TitleText = styled.h2`
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
`;

const PostPrice = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontSize.bottom20};
  text-align: right;
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;

const PostLikeButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14%;
  height: 65px;
  font-size: ${(props) => props.theme.fontSize.title36};
  border: 2px solid #ffda18;
  background-color: #ffffff;
  &:hover {
    cursor: pointer;
    color: #656565;
  }
`;

const OrderButton = styled.button`
  width: 100%;
  height: 65px;
  font-size: ${(props) => props.theme.fontSize.bottom20};
  background-color: #ffda18;
  color: #656565;
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 3px #d1d1d1;
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
  padding: 2rem;
  width: 100%;
  min-height: 320px;
  border: 2px solid #ffda18;
`;

const PostUserInfo = styled.div`
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;

const CommentsWrapper = styled.div`
  
`;
