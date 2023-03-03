import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getUsers, patchUsers } from '../../api';
import * as a from '../../styles/styledComponent/myPage';

const UserName = () => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [editNickNameValue, setEditNickNameValue] = useState('');
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  /* 1. 로그인한 유저 정보를 받아옵니다.
   * 2. 유저의 닉네임에 접근해서 patch합니다.
   * 3. 유저의 닉네임을 수정합니다.
   */
  const { isLoading: getLoading, data } = useQuery(
    ['users', saveUser.uid],
    () => getUsers(saveUser.uid)
  );

  const { isLoading: editNickNameLoading, mutate: editNickNameMutate } =
    useMutation((user: { id: string; nickName: string }) =>
      patchUsers(saveUser.uid, user)
    );

  const EditNickName = async (id: string) => {
    const editNickName = editNickNameValue?.trim();
    if (!editNickName) {
      setEditNickNameValue('');
      return alert('닉네임을 작성해 주세요.');
    }
    const newNickName = {
      id: saveUser.uid,
      nickName: editNickNameValue,
    };

    await editNickNameMutate(newNickName, {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    });
    setIsEdit(false);
  };
  return (
    <a.UserNameWrapper>
      {isEdit ? (
        <>
          <a.EditInputValue
            onChange={(e) => {
              setEditNickNameValue(e.target.value);
            }}
            type="text"
            value={editNickNameValue}
            autoFocus={true}
            placeholder="닉네임을 입력해주세요."
            maxLength={8}
            spellCheck={false}
          />
          <button
            onClick={() => {
              EditNickName(data?.id);
            }}
            aria-label="확인"
          >
            확인
          </button>
        </>
      ) : (
        <>
          <div
            onClick={() => {
              setIsEdit(true);
            }}
          >
            {data?.nickName}
          </div>
        </>
      )}
    </a.UserNameWrapper>
  );
};

export default UserName;
