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
function ReviewPage() {
  const navigate = useNavigate();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const { id } = useParams();
  const [review, setReview] = useState('');
  const [badge, setBadge] = useState('');
  const queryClient = useQueryClient();
  //onSlaepost 데이터 불러오기
  const { data, isLoading } = useQuery(
    ['salePost', id],
    () => getOnSalePost(id),
    {
      select: (data) => {
        return data[0];
      },
      onSuccess: (data) => {
        if (!saveUser || saveUser.uid !== data.buyerUid) {
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
      <h1>후기 남기기</h1>
      <GridBox>
        <ReviewSelectBox onClick={() => setBadge('time')}>
          시간 약속을 잘 지켜요
        </ReviewSelectBox>
        <ReviewSelectBox onClick={() => setBadge('fast')}>
          응답이 빨라요
        </ReviewSelectBox>
        <ReviewSelectBox onClick={() => setBadge('manner')}>
          친절하고 매너가 좋아요
        </ReviewSelectBox>
        <ReviewSelectBox onClick={() => setBadge('service')}>
          상품 설명이 좋아요{' '}
        </ReviewSelectBox>
        <ReviewSelectBox onClick={() => setBadge('cheap')}>
          좋은 서비스를 저렴하게 판매해요
        </ReviewSelectBox>
        <ReviewSelectBox onClick={() => setBadge('donation')}>
          나눔을 해주셨어요{' '}
        </ReviewSelectBox>
      </GridBox>
      <input type="text" value={review} onChange={onChangeReview} />
      <button onClick={submitReview}>작성완료</button>
    </Container>
  );
}

export default ReviewPage;

const Container = styled.div`
  height: 70vh;
  width: 70%;
  margin: 0 auto;
`;
const GridBox = styled.div`
  width: 70%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  div {
  }
`;
const ReviewSelectBox = styled.div`
  border: 1px solid;
`;
