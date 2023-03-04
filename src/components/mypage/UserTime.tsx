import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import { getUsers, patchUsers } from '../../api';
import * as a from '../../styles/styledComponent/myPage';
import { theme } from '../../styles/theme';
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
      {editTime ? (
        <UserTimeEditContainer>
          <form onSubmit={startSubmitTime}>
            <UserTimeEditWrapper>
              <TimeStartEndWrapper>
                <TimeInputWrapper>
                  <label htmlFor="start-time">시작</label>
                  <input
                    id="start-time"
                    name="start-time"
                    type="time"
                    onChange={startTimeChangeHandle}
                    value={startTimeValue}
                  />
                </TimeInputWrapper>
                <TimeInputWrapper>
                  <label htmlFor="end-time">종료</label>
                  <input
                    id="end-time"
                    name="end-time"
                    type="time"
                    onChange={endTimeChangeHandle}
                    value={endTimeValue}
                  />
                </TimeInputWrapper>
              </TimeStartEndWrapper>
              <button>완료</button>
            </UserTimeEditWrapper>
          </form>
        </UserTimeEditContainer>
      ) : (
        <UserTimeWrapper>
          <p>이음 가능 시간 : </p>
          <div
            onClick={() => {
              setEditTime(true);
            }}
          >
            {data?.contactTime == '' ? '시간 설정 하기' : data?.contactTime}
          </div>
        </UserTimeWrapper>
      )}
    </a.MyPageTimeWrapper>
  );
};
export default UserTime;

const UserTimeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 18rem;
  height: 2rem;
  p {
    display: flex;
    justify-content: left;
    align-items: center;
    width: 9rem;
    font-weight: ${theme.fontWeight.bold};
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 9rem;
    height: 2rem;
    font-weight: ${theme.fontWeight.medium};
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${theme.colors.orange02Main};
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      background-color: ${(props) => props.theme.colors.orange03};
      color: ${(props) => props.theme.colors.white};
    }
  }
`;

const UserTimeEditContainer = styled.div`
  width: 18rem;
  height: auto;
  font-size: ${theme.fontSize.title16};
  font-weight: ${theme.fontWeight.medium};
  form {
    width: 18rem;
  }
`;

const UserTimeEditWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 18rem;
  gap: 1rem;
  button {
    width: 5rem;
    font-size: ${theme.fontSize.title16};
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${theme.colors.orange02Main};
    border-radius: 10px;
    &:hover {
      background-color: ${(props) => props.theme.colors.orange03};
      color: ${(props) => props.theme.colors.white};
    }
  }
`;

const TimeStartEndWrapper = styled.div`
  flex-direction: column;
  width: 10rem;
  height: auto;
  gap: 0.2rem;
`;

const TimeInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  input {
    border: 1px solid ${theme.colors.orange02Main};
    border-radius: 10px;
    width: 9rem;
    padding: 0.1rem 1rem;
  }
  label {
    width: 2rem;
    font-weight: ${theme.fontWeight.bold};
  }
`;
