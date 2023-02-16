import { uuidv4 } from '@firebase/util';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase/Firebase';
import { commentType } from '../../types';

const CommentInput = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // 데이터를 저장해줍니다.
  const { mutate } = useMutation(
    (newComment: commentType) =>
      axios.post(`http://localhost:4000/comments`, newComment),
    {
      // 데이터 저장에 성공했다면 캐시무효화로 ui에 바로 업데이트 될 수 있게 해줍니다.
      onSuccess: () => queryClient.invalidateQueries(['comments']),
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
  });

  // comment state가 객체형태이기 때문에 구조분해 할당을 통해 content만 변경될 수 있게 해줍니다.
  const { content } = comment;
  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <form onSubmit={onSubmitCommentHandler}>
        <textarea name="content" value={content} onChange={onChangeContent} />
        <button type="submit">댓글등록</button>
      </form>
    </div>
  );
};

export default CommentInput;
