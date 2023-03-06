import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { uuidv4 } from '@firebase/util';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getOnSalePost,
  getPostsId,
  getUsers,
  patchOnSalePost,
  patchPosts,
  patchUsers,
  postComments,
} from '../api';
import { commentType } from '../types';
import c_cheap from '../styles/badge/choice/c_cheap.webp';
import nc_cheap from '../styles/badge/notChoice/nc_cheap.webp';

import c_donation from '../styles/badge/choice/c_donation.webp';
import nc_donation from '../styles/badge/notChoice/nc_donation.webp';

import c_fast from '../styles/badge/choice/c_fast.webp';
import nc_fast from '../styles/badge/notChoice/nc_fast.webp';

import c_manner from '../styles/badge/choice/c_manner.webp';
import nc_manner from '../styles/badge/notChoice/nc_manner.webp';

import c_service from '../styles/badge/choice/c_service.webp';
import nc_service from '../styles/badge/notChoice/nc_service.webp';

import c_time from '../styles/badge/choice/c_time.webp';
import nc_time from '../styles/badge/notChoice/nc_time.webp';
import ReactQuill from 'react-quill';

function ReviewPage() {
  const navigate = useNavigate();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const { id } = useParams();
  const [review, setReview] = useState('');
  const [badge, setBadge] = useState('');
  const queryClient = useQueryClient();

  const images = [
    [c_time, nc_time],
    [c_manner, nc_manner],
    [c_cheap, nc_cheap],
    [c_fast, nc_fast],
    [c_service, nc_service],
    [c_donation, nc_donation],
  ];
  //onSlaepost 데이터 불러오기
  const { data, isLoading } = useQuery(
    ['salePost', id],
    () => getOnSalePost(id),
    {
      select: (data) => {
        return data[0];
      },
      onSuccess: (data) => {
        if (!saveUser || saveUser.uid !== data.buyerUid || data.isCancel) {
          navigate('/');
        }
        if (data.reviewDone) {
          navigate('/');
        }
      },
    }
  );
  // 판매자 정보 불러오기
  const { data: user, isLoading: userLoading } = useQuery(
    ['user', id],
    () => getUsers(data.sellerUid),
    {
      enabled: !!data,
    }
  );
  // 구매자 정보 불러오기
  const { data: reviewer } = useQuery(['reviewer', id], () =>
    getUsers(saveUser.uid)
  );
  const { mutate } = useMutation(
    (data: any) => {
      const { userId, newUser } = data;
      return patchUsers(userId, newUser);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['test', id]);
      },
    }
  );
  //포스트 데이터 가져오기
  const { data: post } = useQuery(
    ['post', id],
    () => getPostsId(data.postsId),
    {
      select: (data) => {
        return data[0];
      },
      enabled: !!data,
    }
  );

  const { mutate: changeReviewDone } = useMutation(
    (newSalePosts: { reviewDone: boolean }) =>
      patchOnSalePost(id, newSalePosts),
    {
      onSuccess: () => {
        if (!review) {
          navigate('/');
        }
      },
    }
  );

  const { mutate: updateUser } = useMutation(
    (newUser: { commentsCount: number }) => patchUsers(data.sellerUid, newUser),
    {
      onSuccess: () => {
        const newPost = { commentsCount: post.commentsCount + 1 };
        console.log(newPost);
        upPostCount(newPost);
      },
    }
  );

  const { mutate: upPostCount } = useMutation(
    (newPost: { commentsCount: number }) => patchPosts(data.postsId, newPost),
    {
      onSuccess: () => {
        const newComment = {
          id: uuidv4(),
          postId: data.postsId,
          sellerUid: data.sellerUid,
          buyerUid: saveUser?.uid,
          content: review,
          createAt: Date.now(),
          writerNickName: reviewer?.nickName,
          profileImg: reviewer?.profileImg,
        };
        saveText(newComment);
      },
    }
  );

  const { mutate: saveText } = useMutation(
    (newComment: commentType) => postComments(newComment),
    {
      onSuccess: () => {
        navigate('/');
      },
    }
  );
  //1. 판매자 카운트 2. 포스트 카운트, 3.댓글 만들기
  const submitReview = () => {
    if (badge !== '') {
      const newUser = { [badge]: user[badge] + 1 };
      const userId = data.sellerUid;
      mutate({ userId, newUser });
      changeReviewDone({ reviewDone: true });
    }
    if (review.trim() !== '') {
      const newUser = {
        commentsCount: user.commentsCount + 1,
      };
      updateUser(newUser);
      setReview('');
      changeReviewDone({ reviewDone: true });
    }
    if (!badge && !review.trim()) {
      changeReviewDone({ reviewDone: true });
    }
  };
  const onChangeReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview(e.target.value);
  };
  if (isLoading) {
    return <div></div>;
  }
  return (
    <Container>
      <ContainerTitle>후기 보내기</ContainerTitle>
      <ReviewOpinionContainer>
        <p>{reviewer?.nickName}님,</p>
        <p>{user?.nickName}님과 거래가 어떠셨나요?</p>
      </ReviewOpinionContainer>
      <ProductContainer>
        <ProductTitle>판매한 상품</ProductTitle>
        <ProductSeller>{post?.title}</ProductSeller>
        <ProductTitle>거래한 이웃</ProductTitle>
        <ProductSeller>{user?.nickName}</ProductSeller>
      </ProductContainer>
      <BadgeContainer>
        <p>어떤 점이 최고였나요?</p>
        <GridBox>
          <BadgeImg
            imageUrl={badge === 'time' ? images[0][0] : images[0][1]}
            onClick={() => setBadge('time')}
          />

          <BadgeImg
            imageUrl={badge === 'fast' ? images[3][0] : images[3][1]}
            onClick={() => setBadge('fast')}
          />

          <BadgeImg
            imageUrl={badge === 'manner' ? images[2][0] : images[2][1]}
            onClick={() => setBadge('manner')}
          />

          <BadgeImg
            imageUrl={badge === 'service' ? images[1][0] : images[1][1]}
            onClick={() => setBadge('service')}
          />

          <BadgeImg
            imageUrl={badge === 'cheap' ? images[4][0] : images[4][1]}
            onClick={() => setBadge('cheap')}
          />

          <BadgeImg
            imageUrl={badge === 'donation' ? images[5][0] : images[5][1]}
            onClick={() => setBadge('donation')}
          />
        </GridBox>
      </BadgeContainer>
      <ReivewContainer>
        <ReivewTitle>따뜻한 거래 경험을 알려주세요!</ReivewTitle>
        <ReivewInfo>
          남겨주신 거래 후기는 상대방의 프로필에 공개돼요.
        </ReivewInfo>
        <ReivewInput type="text" value={review} onChange={onChangeReview} />
      </ReivewContainer>
      <SubmitButton onClick={submitReview}>작성 완료</SubmitButton>
    </Container>
  );
}

export default ReviewPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 792px;
  margin: 0 auto;
  margin-top: 96px;
`;

const ContainerTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
  text-align: center;
`;
const ReviewOpinionContainer = styled.div`
  p {
    font-size: ${(props) => props.theme.fontSize.ad24};
    font-weight: ${(props) => props.theme.fontWeight.bold};
    line-height: ${(props) => props.theme.lineHeight.ad24};
    margin-bottom: 7px;
  }
`;

const GridBox = styled.div`
  width: 100%;
  height: 176px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 32px 40px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
  div {
  }
`;
const ReviewSelectBox = styled.div`
  border: 1px solid;
`;

const ProductContainer = styled.div`
  display: flex;
  height: 152px;
  flex-direction: column;
  gap: 16px;
`;
const ProductTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray20};
`;
const ProductSeller = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  padding-bottom: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

const BadgeContainer = styled.div`
  height: 208px;

  p {
    font-size: ${(props) => props.theme.fontSize.title20};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    line-height: ${(props) => props.theme.lineHeight.title20};
    padding-bottom: 16px;
  }
`;

const BadgeImg = styled.div<{ imageUrl: string | null }>`
  width: 112px;
  height: 112px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
`;

const ReivewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReivewTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
`;

const ReivewInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.gray20};
`;

const ReivewInput = styled.input`
  width: 100%;
  height: 62px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  padding: 16px 40px;
  font-size: ${(props) => props.theme.fontSize.title20};
  line-height: ${(props) => props.theme.lineHeight.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border-radius: 10px;
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 383px;
  height: 64px;
  border: 1px solid ${(props) => props.theme.colors.orange02Main};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.orange02Main};
  margin: 0 auto;
  margin-bottom: 240px;
  &:hover {
    background-color: ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.white};
  }
`;
