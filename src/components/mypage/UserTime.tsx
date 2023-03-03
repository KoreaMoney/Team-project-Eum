import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getUsers, patchUsers } from '../../api';
import * as a from '../../styles/styledComponent/myPage';
import { customWarningAlert } from '../modal/CustomAlert';

const UserTime = () => {
  const queryClient = useQueryClient();
  const [startTimeValue, setStartTimeValue] = useState('');
  const [endTimeValue, setEndTimeValue] = useState('');
  const [editTime, setEditTime] = useState(false);
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  /* 1. 로그인한 유저 정보를 받아옵니다.
   * 2. 유저의 연락 가능한 시간에 접근해서 patch합니다.
   */
  const { isLoading: getLoading, data } = useQuery(
    ['users', saveUser.uid],
    () => getUsers(saveUser.uid)
  );

  const { isLoading: editUserTimeLoading, mutate: editUserTimeMutate } =
    useMutation((user: { id: string; contactTime: string }) =>
      patchUsers(saveUser.uid, user)
    );

  /* 유저 연락 가능한 시간을 수정합니다.
   * 1. 시작시간을 지정합니다.
   * 2. 종료시간을 지정합니다.
   * 3. 시작시간 - 종료시간 형태로 수정합니다.
   **/
  const startTimeChangeHandle = (e: any) => {
    setStartTimeValue(e.target.value);
  };
  const endTimeChangeHandle = (e: any) => {
    setEndTimeValue(e.target.value);
  };
  const startSubmitTime = async (e: any) => {
    e.preventDefault();
    const startTime = startTimeValue.trim();
    const endTime = endTimeValue.trim();
    if (!startTime || !endTime) {
      setStartTimeValue('');
      setEndTimeValue('');
      customWarningAlert('연락 가능한 시간을 지정해주세요.');
      return;
    }
    const newTime = {
      id: saveUser.uid,
      contactTime: `${startTimeValue} - ${endTimeValue}`,
    };
    await editUserTimeMutate(newTime, {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    });

    setEditTime(false);
  };
  return (
    <a.MyPageTimeWrapper>
      <p>이음 가능 시간 : </p>
      {editTime ? (
        <div>
          <form onSubmit={startSubmitTime}>
            <label htmlFor="start-time">이음 시작</label>
            <input
              id="start-time"
              name="start-time"
              type="time"
              onChange={startTimeChangeHandle}
              value={startTimeValue}
            />
            <label htmlFor="end-time">이음 종료</label>
            <input
              id="end-time"
              name="end-time"
              type="time"
              onChange={endTimeChangeHandle}
              value={endTimeValue}
            />
            <button>완료</button>
          </form>
        </div>
      ) : (
        <div>
          {data?.contactTime}
          <button
            onClick={() => {
              setEditTime(true);
            }}
          >
            수정
          </button>
        </div>
      )}
    </a.MyPageTimeWrapper>
  );
};
export default UserTime;
