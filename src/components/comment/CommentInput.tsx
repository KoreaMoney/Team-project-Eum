import { uuidv4 } from '@firebase/util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../../firebase/Firebase';
import { commentType } from '../../types';
const CommentInput = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  // 데이터를 저장해줍니다.
  const { mutate } = useMutation(
    (newComment: commentType) =>
      axios.post(`http://localhost:4000/comments`, newComment),
    {
      // 데이터 저장에 성공했다면 캐시무효화로 ui에 바로 업데이트 될 수 있게 해줍니다.
      onSuccess: () => queryClient.invalidateQueries(['comments']),
    }
  );
  // 글쓴이 프로필이미지 가져오려고..
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
  // uuidv4()를 변수로 지정해서 넣으면 uuid가 바뀌지 않는 이슈가 있습니다.
  // id에 uuidv4를 바로 할당해 지속적으로 바뀔 수 있게 해줍니다.
  const [comment, setComment] = useState({
    id: uuidv4(),
    postId: id,
    content: '',
    createAt: Date.now(),
    writer: auth.currentUser?.uid,
    writerNickName: auth.currentUser?.displayName,
    isEdit: false,
    profileImg: '',
  });
  // comment state가 객체형태이기 때문에 구조분해 할당을 통해 content만 변경될 수 있게 해줍니다.
  const { content } = comment;

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment({
      ...comment,
      content: e.target.value,
    });
  };
  console.log('comment: ', comment);
  // 글 등록 버튼을 누르면 실행되는 함수입니다.
  const onSubmitCommentHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    await mutate({
      ...comment,
      content,
      id: uuidv4(),
      writer: auth.currentUser?.uid,
      writerNickName: auth.currentUser?.displayName,
    });
    // 저장 후 textarea를 초기화 시켜줍니다.
    // uuidv4()를 다시 할당해줘서 uuid가 바뀌게 해줍니다.
    setComment({
      ...comment,
      content: '',
      id: uuidv4(),
    });
  };

  return (
    <div>
      <CommentTitleText>한줄 후기를 남겨주세요.</CommentTitleText>
      <CommentContainer onSubmit={onSubmitCommentHandler}>
        <InputTag name="content" value={content} onChange={onChangeContent} />
        <AddCommentButton type="submit">댓글등록</AddCommentButton>
      </CommentContainer>
    </div>
  );
};
export default CommentInput;
const CommentTitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.title24};
  margin: 3rem 0 1rem;
`;
const CommentContainer = styled.form`
  display: flex;
  justify-content: space-between;
`;
const InputTag = styled.input`
  width: 90%;
  font-size: ${(props) => props.theme.fontSize.body16};
  padding: 0.5rem;
  border: 2px solid ${(props) => props.theme.colors.brandColor};
  background-color: ${(props) => props.theme.colors.white};
  &:focus {
    outline: none;
  }
`;
const AddCommentButton = styled.button`
  border: none;
  background-color: black;
  width: 70px;
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.white};
  &:hover {
    cursor: pointer;
  }
`;
