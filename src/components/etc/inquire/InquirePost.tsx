import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteInquire, updateInquire } from '../../../api';
import {
  customConfirm,
  customSuccessAlert,
  customWarningAlert,
} from '../../modal/CustomAlert';

const InquirePost = ({ p }: any) => {
  const queryClient = useQueryClient();
  const [editTitleValue, setEditTitleValue] = useState('');
  const [editContentValue, setEditContentValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { isLoading: updateLoading, mutate: updateMutate } =
    useMutation(updateInquire);
  const { isLoading: deleteLoading, mutate: deleteMutate } =
    useMutation(deleteInquire);

  const editTitleHandle = (e: any) => {
    setEditTitleValue(e.target.value);
  };

  const editContentHandle = (e: any) => {
    setEditTitleValue(e.target.value);
  };

  const updateHandler = async () => {
    const editTitle = editTitleValue?.trim();
    if (!editTitle) {
      setEditTitleValue('');
      customWarningAlert('수정할 제목을 입력해 주세요');
      return;
    }
    const editContent = editContentValue?.trim();
    if (!editContent) {
      setEditContentValue('');
      customWarningAlert('수정할 내용을 입력해 주세요');
      return;
    }
    const inquireData = {
      title: editTitleValue,
      content: editContentValue,
    };
    await updateMutate(inquireData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['editinquires']);
        setIsEdit(false);
      },
      onError: (error) => {
        console.dir('error: ', error);
      },
    });
  };
  const deleteHandler = () => {
    customConfirm('삭제 하시겠습니까?', '삭제하기', '취소하기', async () => {
      await deleteMutate(p, {
        onSuccess: () => {
          queryClient.invalidateQueries(['delinquires']);
        },
        onError: (error) => {
          console.dir('error: ', error);
        },
      });
      customSuccessAlert('삭제하였습니다.');
    });
  };

  return (
    <div>
      <div id={p.id} key={p.id}>
        {isEdit ? (
          <div>
            <input
              type="text"
              onChange={editTitleHandle}
              value={editTitleValue}
              placeholder="수정할 제목을 입력해주세요."
              maxLength={32}
            />
            <input
              type="text"
              onChange={editContentHandle}
              value={editContentValue}
              placeholder="수정할 내용을 입력해주세요."
            />
            <button onClick={updateHandler}>확인</button>
            <button onClick={deleteHandler}>삭제</button>
          </div>
        ) : (
          <div>
            <p>{p.title}</p>
            <p>{p.content}</p>
            <button
              onClick={() => {
                setIsEdit(true);
              }}
            >
              수정
            </button>
            <button onClick={deleteHandler}>삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquirePost;
