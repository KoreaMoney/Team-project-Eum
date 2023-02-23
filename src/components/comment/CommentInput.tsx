import React, { useEffect, useState } from 'react';
import { uuidv4 } from '@firebase/util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { commentType } from '../../types';

/**순서
 * 1. 글쓴기 데이터 가져오기
 * 2. 데이터 저장하기
 */
const CommentInput = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //글쓴이 정보 get하기
  const { data: user } = useQuery(['user', saveUser?.uid], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_JSON}/users/${saveUser?.uid}`
    );
    return response.data;
  });

  /**데이터 저장
   * 데이터 저장에 성공했다면 캐시무효화로 ui에 바로 업데이트 될 수 있게 해준다 */
  const { mutate } = useMutation(
    (newComment: commentType) =>
      axios.post(`${process.env.REACT_APP_JSON}/comments`, newComment),
    {
      onSuccess: () => queryClient.invalidateQueries(['comments']),
    }
  );

  /**uuidv4()를 변수로 지정해서 넣으면 uuid가 바뀌지 않는 이슈 존재
   * id에 uuidv4를 바로 할당해 지속적으로 바뀔 수 있게 해준다
   */
  const [comment, setComment] = useState({
    id: uuidv4(),
    postId: id,
    content: '',
    createAt: Date.now(),
    writer: saveUser.uid,
    writerNickName: user?.nickName,
    isEdit: false,
    profileImg: user?.profileImg,
  });

  // comment state가 객체형태이기 때문에 구조분해 할당을 통해 content만 변경될 수 있게 해줍니다.
  const { content } = comment;

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment({
      ...comment,
      content: e.target.value,
    });
  };

  /**글 등록 버튼을 누르면 실행되는 함수
   * 저장 후 textarea를 초기화 진행
   * uuidv4()를 다시 할당해줘서 uuid 변경
   */
  const onSubmitCommentHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await mutate(comment);
    setComment({
      ...comment,
      content: '',
      id: uuidv4(),
    });
  };
  useEffect(() => {
    setComment({
      ...comment,
      writer: user?.id,
      writerNickName: user?.nickName,
      profileImg: user?.profileImg,
    });
  }, [user]);

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
  padding: 0.5rem;
  font-size: ${(props) => props.theme.fontSize.body16};
  border: 2px solid ${(props) => props.theme.colors.brandColor};
  background-color: ${(props) => props.theme.colors.white};
  &:focus {
    outline: none;
  }
`;
const AddCommentButton = styled.button`
  width: 70px;
  border: none;
  background-color: ${(props) => props.theme.colors.black};
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.white};
  &:hover {
    cursor: pointer;
  }
`;
