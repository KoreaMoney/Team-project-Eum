import React, { useState } from 'react';
import { uuidv4 } from '@firebase/util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { commentType } from '../../types';
import { getPostsId, getUsers, patchUsers, postComments } from '../../api';

import styled from 'styled-components';

/**순서
 * 1. 글쓴기 데이터 가져오기
 * 2. 데이터 저장하기
 */
const CommentInput = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //판매자 uid를 post를 이용해 get하기
  const { data: post } = useQuery(['post', id], () => getPostsId(id), {
    staleTime: Infinity,
  });

  //댓글쓴이 정보 get하기
  const { data: buyerUser } = useQuery(
    ['user', saveUser.uid],
    () => getUsers(saveUser.uid),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
    }
  );

  //커맨트 카운트 +1을 위한 판매자 정보 get하기
  const { data: sellerUser } = useQuery(
    ['user', post?.[0].sellerUid],
    () => getUsers(post?.[0].sellerUid),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
    }
  );

  const [comment, setComment] = useState<commentType>({
    id: '',
    postId: '',
    sellerUid: '',
    buyerUid: '',
    content: '',
    profileImg: '',
    createAt: 0,
    writerNickName: '',
  });

  /**데이터 저장
   * 데이터 저장에 성공했다면 캐시무효화로 ui에 바로 업데이트 될 수 있게 해준다 */

  const { mutate } = useMutation(
    (newComment: commentType) => postComments(newComment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments']);
      },
    }
  );

  /**uuidv4()를 변수로 지정해서 넣으면 uuid가 바뀌지 않는 이슈 존재
   * id에 uuidv4를 바로 할당해 지속적으로 바뀔 수 있게 해준다
   * comment state가 객체형태이기 때문에 구조분해 할당을 통해 content만 변경될 수 있게 해줍니다.
   */
  const { content } = comment;

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment({
      ...comment,
      content: e.target.value,
    });
  };

  //  comment가 달리면 판매자 user data의 commentsCount가 +1이 된다.
  const { mutate: updateUser } = useMutation(
    (newUser: { commentsCount: number }) =>
      patchUsers(post?.[0].sellerUid, newUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', sellerUser?.id]);
      },
    }
  );

  /**글 등록 버튼을 누르면 실행되는 함수
   * 저장 후 textarea를 초기화 진행
   * uuidv4()를 다시 할당해줘서 uuid 변경
   */
  const onSubmitCommentHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      id: uuidv4(),
      postId: id,
      sellerUid: post?.[0].sellerUid,
      buyerUid: saveUser?.uid,
      content,
      createAt: Date.now(),
      writerNickName: buyerUser?.nickName,
      profileImg: buyerUser?.profileImg,
    });
    updateUser({
      commentsCount: sellerUser?.commentsCount + 1,
    });
    setComment({
      id: '',
      postId: '',
      sellerUid: '',
      buyerUid: '',
      content: '',
      profileImg: '',
      createAt: 0,
      writerNickName: '',
    });
  };
  return (
    <div>
      <CommentContainer onSubmit={onSubmitCommentHandler} aria-label="리뷰작성">
        <ProfileIMG profileIMG={buyerUser?.profileImg} />
        <InputTag name="content" value={content} onChange={onChangeContent} />
        <AddCommentButton type="submit" aria-label="리뷰 등록">
          리뷰 등록
        </AddCommentButton>
      </CommentContainer>
    </div>
  );
};

export default CommentInput;

const ProfileIMG = styled.div<{ profileIMG: string | undefined | null }>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 0.5rem;
`;

const CommentContainer = styled.form`
  display: flex;
  justify-content: space-between;
`;
const InputTag = styled.input`
  width: 90%;
  padding: 0.5rem;
  font-size: 16px;
  border: 2px solid yellow;
  background-color: ${(props) => props.theme.colors.white};
  &:focus {
    outline: none;
  }
`;
const AddCommentButton = styled.button`
  width: 10%;
  border: none;
  background-color: ${(props) => props.theme.colors.black};
  font-size: 16px;
  color: ${(props) => props.theme.colors.white};
  &:hover {
    cursor: pointer;
  }
`;
