import * as a from '../styles/styledComponent/reviewPage';
import { uuidv4 } from '@firebase/util';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

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
import { customSuccessAlert } from '../components/modal/CustomAlert';

import {
  getOnSalePost,
  getPostsId,
  getUsers,
  patchOnSalePost,
  patchPosts,
  patchUsers,
  postComments,
} from '../api';

function ReviewPage() {
  const navigate = useNavigate();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const { id } = useParams();
  const [review, setReview] = useState('');
  const [badge, setBadge] = useState('');

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
        if (!saveUser || saveUser.uid !== data.buyerUid || !data.isDone) {
          navigate('/');
        }
        if (data.reviewDone) {
          navigate('/');
        }
      },
    }
  );

  // 판매자 정보 불러오기
  const { data: user } = useQuery(
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
  const { mutate } = useMutation((data: any) => {
    const { userId, newUser } = data;
    return patchUsers(userId, newUser);
  });

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
        navigate('/');
      },
    }
  );

  const { mutate: updateUser } = useMutation(
    (newUser: { commentsCount: number }) => patchUsers(data.sellerUid, newUser),
    {
      onSuccess: () => {
        const newPost = { commentsCount: post.commentsCount + 1 };
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
        changeReviewDone({ reviewDone: true });
      },
    }
  );

  //1. 판매자 카운트 2. 포스트 카운트, 3.댓글 만들기
  const submitReview = () => {
    if (badge) {
      const newUser = { [badge]: user[badge] + 1 };
      const userId = data.sellerUid;
      mutate({ userId, newUser });
      if (!review.trim()) {
        changeReviewDone({ reviewDone: true });
      }
    }
    if (review.trim()) {
      const newUser = {
        commentsCount: user.commentsCount + 1,
      };
      updateUser(newUser);
    }
    if (!badge && !review.trim()) {
      changeReviewDone({ reviewDone: true });
    }
    customSuccessAlert(
      '후기 등록이 되었습니다!\n\n숨겨둔 재능! 숨기지 말아요!'
    );
  };

  const onChangeReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview(e.target.value);
  };
  if (isLoading) {
    return <div></div>;
  }

  return (
    <a.Container>
      <a.ContainerTitle>후기 보내기</a.ContainerTitle>
      <a.ReviewOpinionContainer>
        <p>{reviewer?.nickName}님,</p>
        <p>{user?.nickName}님과 거래가 어떠셨나요?</p>
      </a.ReviewOpinionContainer>
      <a.ProductContainer>
        <a.ProductTitle>매칭한 상품</a.ProductTitle>
        <a.ProductSeller>{post?.title}</a.ProductSeller>
        <a.ProductTitle>거래한 이웃</a.ProductTitle>
        <a.ProductSeller>{user?.nickName}</a.ProductSeller>
      </a.ProductContainer>
      <a.BadgeContainer>
        <p>어떤 점이 최고였나요?</p>
        <a.GridBox>
          <a.BadgeImg
            imageUrl={badge === 'time' ? images[0][0] : images[0][1]}
            onClick={() => setBadge('time')}
          />

          <a.BadgeImg
            imageUrl={badge === 'fast' ? images[3][0] : images[3][1]}
            onClick={() => setBadge('fast')}
          />

          <a.BadgeImg
            imageUrl={badge === 'manner' ? images[1][0] : images[1][1]}
            onClick={() => setBadge('manner')}
          />

          <a.BadgeImg
            imageUrl={badge === 'service' ? images[4][0] : images[4][1]}
            onClick={() => setBadge('service')}
          />

          <a.BadgeImg
            imageUrl={badge === 'cheap' ? images[2][0] : images[2][1]}
            onClick={() => setBadge('cheap')}
          />

          <a.BadgeImg
            imageUrl={badge === 'donation' ? images[5][0] : images[5][1]}
            onClick={() => setBadge('donation')}
          />
        </a.GridBox>
      </a.BadgeContainer>
      <a.ReviewContainer>
        <a.ReviewTitle>따뜻한 거래 경험을 알려주세요!</a.ReviewTitle>
        <a.ReviewInfo>
          남겨주신 거래 후기는 상대방의 프로필에 공개돼요.
        </a.ReviewInfo>
        <a.ReviewInput type="text" value={review} onChange={onChangeReview} />
      </a.ReviewContainer>
      <a.SubmitButton onClick={submitReview}>작성 완료</a.SubmitButton>
    </a.Container>
  );
}

export default ReviewPage;
