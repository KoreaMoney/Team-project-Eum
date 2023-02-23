import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { getProfilePoint } from '../../api';
import { CustomModal } from '../modal/CustomModal';
import PointHistoryList from './PointHistoryList';
const PointModal = () => {
  const queryClient = useQueryClient();
  const [isModalActive, setIsModalActive] = useState(false);
  const {
    isLoading: getProfilePintLoading,
    isError: getProfilePintIsError,
    data: profileData,
    error: getProfilePintError,
  } = useQuery(['users'], getProfilePoint);

  console.log('profileData: ', profileData?.[0]);

  // 커스텀모달을 불러옵니다.

  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  const pointChargehandle = () => {
    alert('이벤트 기간 동안 지급된 포인트로 활동하세요!');
  };

  const pointWithdrawhandle = () => {
    alert('이벤트 기간 종료 후 추가되는 포인트만 출금 가능합니다.');
  };
  return (
    <>
      <PointButton onClick={onClickToggleModal}>
        <p>포인트</p>
        <div>
          {' '}
          {profileData?.[0] &&
            profileData[0].point &&
            profileData[0].point
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          P
        </div>
      </PointButton>
      {isModalActive ? (
        <CustomModal
          modal={isModalActive}
          setModal={setIsModalActive}
          width="800"
          height="800"
          element={
            <PointModalContainer>
              <CloseButton onClick={onClickToggleModal}>X</CloseButton>
              <PointImgWrapper>
                <img src="/assets/walletmoney.png" />
                <h3>　내 포인트</h3>
              </PointImgWrapper>
              <CurrentPoint>
                {profileData?.[0] &&
                  profileData[0].point &&
                  profileData[0].point
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                P
              </CurrentPoint>
              <PointDepositWithdrawWrapper>
                <PointDepositButton
                  onClick={() => {
                    pointChargehandle();
                  }}
                >
                  <img src="/assets/moneysend.png" />
                  <h3>　충전하기</h3>
                </PointDepositButton>
                <PointWithdrawButton
                  onClick={() => {
                    pointWithdrawhandle();
                  }}
                >
                  <img src="/assets/emptywalletadd.png" />
                  <h3>　출금하기</h3>
                </PointWithdrawButton>
              </PointDepositWithdrawWrapper>
              <PointHistoryList />
            </PointModalContainer>
          }
        />
      ) : (
        ''
      )}
    </>
  );
};

const PointButton = styled.button`
  margin-bottom: 2rem;
  width: 18rem;
  height: 2rem;
  font-size: 100%;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const PointModalContainer = styled.div`
  width: 800px;
  height: 800px;
  padding: 10%;
  color: black;
`;

const PointImgWrapper = styled.div`
  margin-bottom: 12px;
  width: 100%;
  font-size: 100%;
  display: flex;
  align-items: center;
`;

const CurrentPoint = styled.div`
  margin-bottom: 24px;
  padding: 12px 40px;
  width: 100%;
  height: 80px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

const PointDepositWithdrawWrapper = styled.div`
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

const PointDepositButton = styled.button`
  width: 50%;
  height: 72px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const PointWithdrawButton = styled.button`
  width: 50%;
  height: 72px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  width: 40px;
  height: 40px;
  right: 12px;
  top: 12px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

export default PointModal;
