import { uuidv4 } from '@firebase/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createInquire } from '../../../api';
import {
  customSuccessAlert,
  customWarningAlert,
} from '../../modal/CustomAlert';

const AddForm = () => {
  const queryClient = useQueryClient();
  const [titleValue, setTitleValue] = useState('');
  const [contentValue, setContentValue] = useState('');
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const { isLoading: createLoading, mutate: createMutate } =
    useMutation(createInquire);

  const contentChangeHandle = (e: any) => {
    setContentValue(e.target.value);
  };
  const titleChangeHandle = (e: any) => {
    setTitleValue(e.target.value);
  };
  const submitContent = (e: any) => {
    e.preventDefault();
    const title = titleValue.trim();
    if (!title) {
      setTitleValue('');
      customWarningAlert('제목을 입력해 주세요');
      return;
    }
    const content = contentValue.trim();
    if (!content) {
      setContentValue('');
      customWarningAlert('내용을 입력해 주세요');
      return;
    }
    const newContent = {
      id: uuidv4(),
      Userid: saveUser?.uid,
      title: titleValue,
      content: contentValue,
      isDone: false,
    };
    createMutate(newContent, {
      onSuccess: () => {
        queryClient.invalidateQueries(['inquires']);
        customSuccessAlert('문의를 정상적으로 등록하였습니다.');
      },
    });
    setTitleValue('');
    setContentValue('');
  };
  return (
    <form onSubmit={submitContent}>
      <label htmlFor="new-title">제목</label>
      <input
        id="new-title"
        name="new-title"
        type="text"
        value={titleValue}
        onChange={titleChangeHandle}
        placeholder="문의 제목을 적어주세요."
        maxLength={32}
        autoFocus={true}
      />
      <label htmlFor="new-content">문의 내용</label>
      <input
        id="new-content"
        name="new-content"
        type="text"
        value={contentValue}
        onChange={contentChangeHandle}
        placeholder="문의 내용을 적어주세요."
        autoFocus={false}
      />
      <button>문의하기</button>
    </form>
  );
};

export default AddForm;
