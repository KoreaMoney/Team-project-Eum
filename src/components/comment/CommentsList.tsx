import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase/Firebase';
import { commentType } from '../../types';
import { customConfirm } from '../modal/CustomAlert';

const CommentsList = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  console.log('idid', auth.currentUser?.uid);
  // 댓글을 불러오는 코드
  // postId와 url id가 동일한 부분만 출력할 수 있게 해줍니다.
  const { data } = useQuery(['comments'], async () => {
    const response = await axios.get(
      `http://localhost:4000/comments?postId=${id}`
    );
    return response.data;
  });

  // 댓글을 삭제하는 코드.
  // onClickDeleteComment 함수에서 commentId를 받아와 클릭한 댓글만 삭제될 수 있도록 합니다.
  const { mutate: deleteComment } = useMutation(
    (commentId: string) =>
      axios.delete(`http://localhost:4000/comments/${commentId}`),
    {
      // 댓글을 성공적으로 삭제했다면 쿼리무효화를 통해 ui에 바로 업뎃될 수 있도록 해줍니다.
      onSuccess: () => {
        queryClient.invalidateQueries(['comments']);
      },
    }
  );
  const onClickDeleteComment = async (commentId: string) => {
    customConfirm('정말 삭제하시겠습니까?', '댓글 삭제', '삭제', async () => {
      await deleteComment(commentId);
    });
  };

  // 댓글 작성 시간을 n분전 으로 출력해주는 함수
  // 7일 이상이 된 댓글은 yyyy-mm-dd hh:mm 형식으로 출력됩니다.
  const getTimegap = (posting: number) => {
    const msgap = Date.now() - posting;
    const minutegap = Math.floor(msgap / 60000);
    const hourgap = Math.floor(msgap / 3600000);
    if (msgap < 0) {
      return '방금 전';
    }
    if (hourgap > 24) {
      const time = new Date(posting);
      const timegap =
        time.toJSON().substring(0, 10) + ' ' + time.toJSON().substring(11, 16);
      return <p>{timegap}</p>;
    }
    if (minutegap > 59) {
      return <p>{hourgap}시간 전</p>;
    } else {
      if (minutegap === 0) {
        return '방금 전';
      } else {
        return <p>{minutegap}분 전</p>;
      }
    }
  };

  console.log('data: ', data);

  return (
    <div>
      <h1>Comment : {data?.length}</h1>
      {data &&
        data.map((item: commentType) => {
          return (
            <div
              style={{ display: 'flex', marginBottom: '10px' }}
              key={item.id}
            >
              <ul style={{ border: '1px solid #000000' }}>
                <li>닉네임 :{item.writerNickName}</li>
                <li>댓글내용 :{item.content}</li>
                <li>글작성시간 :{getTimegap(item.createAt)}</li>
              </ul>
              <button onClick={() => onClickDeleteComment(item.id)}>
                삭제
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default CommentsList;
