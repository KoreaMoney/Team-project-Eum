import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styled from 'styled-components';
import CommentInput from '../components/comment/CommentInput';
import CommentsList from '../components/comment/CommentsList';
import basicIMG from '../styles/basicIMG.png';

import { AiFillLike, AiFillHeart, AiOutlineLike } from 'react-icons/ai';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import { auth } from '../firebase/Firebase';
import { onSalePostType, userType } from '../types';
import parse from 'html-react-parser';
import SignIn from './SignIn';
import { DocumentData } from 'firebase/firestore';

const Detail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { categoryName } = useParams();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const location = useLocation();
  const [sellerData, setSellerData] = useState<{ like: any[] }>({ like: [] });
  const [postData, setPostData] = useState<{ like: any[] }>({ like: [] });
  const queryClient = useQueryClient();
  // 클릭한 글의 데이터를 가지고 옵니다.

  const { data: post, isLoading } = useQuery(['post', id], async () => {
    // 쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
    const response = await axios.get(
      `${process.env.REACT_APP_JSON}/posts?id=${id}`
    );
    return response.data;
  });

  // onSalePosts 데이터가 생성 코드
  const { mutate: onSalePosts } = useMutation((newSalePosts: onSalePostType) =>
    axios.post(`${process.env.REACT_APP_JSON}/onSalePosts`, newSalePosts)
  );

  // 판매자의 프로필이미지를 위해 데이터 가져오기
  const { data: seller } = useQuery(
    ['user', post?.[0].sellerUid],
    async () => {
      const response = await axios.get(

        `${process.env.REACT_APP_JSON}/users/${post?.[0].sellerUid}`

      );
      return response.data;
    },
    {
      enabled: Boolean(post?.[0].sellerUid), // saveUser?.uid가 존재할 때만 쿼리를 시작
    }
  );
console.log( 'post?.[0].sellerUid: ' ,post?.[0].sellerUid);

  
  // 포인트 수정을 위한 유저정보 get
  const { data: user } = useQuery(
    ['user', saveUser?.uid],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/users/${post?.[0].sellerUid}`
      );
      return response.data;
    },
    {
      enabled: Boolean(saveUser?.uid), // saveUser?.uid가 존재할 때만 쿼리를 시작
    }
  );

  // 포인트를 수정해주는 mutation 함수
  const { mutate: updateUser } = useMutation((newUser: { point: string }) =>
    axios.patch(`${process.env.REACT_APP_JSON}/users/${saveUser?.uid}`, newUser)
  );

  // 좋아요 기능을 위해
  const { mutate: updateSeller } = useMutation(
    (newUser: { like: string[] }) =>

      axios.patch(`${process.env.REACT_APP_JSON}/users/${seller?.id}`, newUser),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', seller?.id]);
        setSellerData((prev: any) => ({
          ...prev,
          like: countCheck
            ? prev.like.filter((prev: any) => prev !== saveUser?.uid)
            : [...(prev.like || []), saveUser?.uid],
        }));
      },
      onError: (error, newUser, rollback) => {
        console.log(error);
      },
    }
  );

  // 글 찜 기능을 위해
  const postCountCheck = post?.[0].like.includes(saveUser?.uid);
  console.log('postCountCheck: ', postCountCheck);

  const { mutate: updatePost } = useMutation(
    (newPosts: { like: string[] }) =>

      axios.patch(`${process.env.REACT_APP_JSON}/posts/${id}`, newPosts),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', id]);
        setPostData((prev: any) => ({
          ...prev,
          like: postCountCheck
            ? prev.like.filter((prev: any) => prev !== saveUser?.uid)
            : [...(prev.like || []), saveUser?.uid],
        }));
      },
      onError: (error, newUser, rollback) => {
        console.log(error);
      },
    }
  );

  const postCounter = async () => {
    if (saveUser) {
      if (postCountCheck) {
        await updatePost({
          like: post?.[0].like.filter((prev: any) => prev !== saveUser?.uid),
        });
      } else {
        await updatePost({
          like: [...(post?.[0].like || []), saveUser?.uid],
        });
      }
    } else {
      return <SignIn />;
    }
  };

  const countCheck = seller?.like.includes(saveUser?.uid);

  const counter = async () => {
    if (saveUser) {
      if (countCheck) {
        await updateSeller({
          like: seller?.like.filter((prev: any) => prev !== saveUser?.uid),
        });
      } else {
        await updateSeller({
          like: [...(seller?.like || []), saveUser?.uid],
        });
      }
    } else {
      return <SignIn />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!post || post.length === 0) {
    return <div>No data found</div>;
  }

  // 바로 신청하기 버튼 클릭 하면
  // user 데이터의 point가 price만큼 빠지고
  // mutate로 데이터를 저장합니다.

  const onClickApplyBuy = async () => {
    // 구매자의 포인트에서 price만큼 뺀걸 구매자의 user에 업데이트
    if (saveUser) {
      await updateUser({
        point: String(Number(user?.point) - Number(post?.[0]?.price)),
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
        createdAt: Date.now(),
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
      <EditDeleteButtonContainer>
        {saveUser && (
          <>
            <EditDeleteButton>수정</EditDeleteButton>
            <EditDeleteButton>삭제</EditDeleteButton>
          </>
        )}
      </EditDeleteButtonContainer>
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
                    <RightButtonContainer onClick={counter}>
                      {countCheck ? <LikeIcon /> : <NoLikeIcon />}
                      <LikeCounter>{seller?.like?.length}</LikeCounter>
                    </RightButtonContainer>
                  </ProfileButtons>
                </ProfileButtonContainer>
              </BottomBottomContainer>
            </SellerProfileBottomDiv>
          </SellerProfileContainer>
          <LikeAndSubmitContainer>
            <PostLikeButtonContainer>
              {postCountCheck ? (
                <HeartIcon onClick={postCounter} />
              ) : (
                <NoHeartIcon onClick={postCounter} />
              )}
            </PostLikeButtonContainer>
            <OrderButton onClick={onClickApplyBuy}>바로 신청하기</OrderButton>
          </LikeAndSubmitContainer>
        </PostInfoWrapper>
      </PostContainer>
      <PostContentWrapper>
        <PostContent>{parse(post[0].content)}</PostContent>
      </PostContentWrapper>
      <div>
        <div>
          {saveUser && <CommentInput />}
          <CommentsList />
        </div>
      </div>
    </DetailContainer>
  );
};

export default Detail;

const NoLikeIcon = styled(AiOutlineLike)``;

const NoHeartIcon = styled(FcLikePlaceholder)``;

const DetailContainer = styled.div`
  width: 60%;
  margin: 0 auto;
`;

const EditDeleteButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const PostContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4rem;
  margin-bottom: 24px;
`;

const PostImage = styled.div<{ img: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 490px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.gray10};
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.img});
`;

const PostInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  height: 490px;
`;

const TitleText = styled.h2`
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
`;

const PostPrice = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontSize.bottom20};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  text-align: right;
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
  display: flex;
  width: 100%;
  height: 5rem;
  background-color: rgba(255, 218, 24, 0.8);
`;

const TopLeftContainer = styled.div`
  position: relative;
  width: 30%;
`;

const TopRightContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 70%;
  margin-bottom: 0.5rem;
`;

const SellerNickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
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

const SellerProfileBottomDiv = styled.div`
  width: 100%;
  height: 11rem;
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
  background-color: ${(props) => props.theme.colors.brandColor};
  border: none;
  &:hover {
    box-shadow: 2px 2px 4px #d5d5d5;
  }
`;

const RightButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const LikeIcon = styled(AiFillLike)`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;

const LikeCounter = styled.p`
  font-size: ${(props) => props.theme.fontSize.body16};
`;

const LikeAndSubmitContainer = styled.div`
  display: flex;
  gap: 3rem;
`;

const PostLikeButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14%;
  height: 65px;
  font-size: ${(props) => props.theme.fontSize.title36};
  border: 2px solid ${(props) => props.theme.colors.brandColor};
  background-color: ${(props) => props.theme.colors.white};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.gray30};
  }
`;

const HeartIcon = styled(AiFillHeart)`
  color: ${(props) => props.theme.colors.red};
`;

const OrderButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 4rem;
  color: ${(props) => props.theme.colors.gray40};
  font-size: ${(props) => props.theme.fontSize.bottom20};
  background-color: ${(props) => props.theme.colors.brandColor};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 3px #d1d1d1;
  }
`;

const PostContentWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const PostContent = styled.div`
  padding: 2rem;
  width: 100%;
  min-height: 20rem;
  border: 2px solid ${(props) => props.theme.colors.brandColor};
`;

const CommentsWrapper = styled.div``;

const EditDeleteButton = styled.button`
  width: 5rem;
  height: 2.5rem;
  border: none;
  font-size: ${(props) => props.theme.fontSize.bottom20};
  background-color: ${(props) => props.theme.colors.brandColor};
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 3px #d1d1d1;
  }
`;
