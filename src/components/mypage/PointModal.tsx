import { useQuery } from '@tanstack/react-query';
import { customInfoAlert, customWarningAlert } from '../modal/CustomAlert';
import { getUsers } from '../../api';
import { theme } from '../../styles/theme';

import PointHistoryList from './PointHistoryList';
import styled from 'styled-components';

const PointModal = () => {
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  // 로그인한 유저 정보를 불러옵니다
  const { data: profileData } = useQuery(['users'], () =>
    getUsers(saveUser.uid)
  );

  const pointChargeHandle = () => {
    customInfoAlert('이벤트 기간 동안 \n지급된 포인트로 활동해주세요!');
  };

  const pointWithDrawHandle = () => {
    customWarningAlert(
      '이벤트 기간 종료 후\n\n 추가되는 포인트만\n 출금 가능합니다.'
    );
  };

  return (
    <>
      <PointModalContainer>
        <PointImgWrapper>
          <div>내 포인트</div>
        </PointImgWrapper>
        <CurrentPoint>
          {profileData &&
            profileData?.point &&
            profileData?.point
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
          P
        </CurrentPoint>
        <PointDepositWithdrawWrapper>
          <PointWithdrawButton
            onClick={() => {
              pointWithDrawHandle();
            }}
            aria-label="출금하기"
          >
            <div>출금하기</div>
          </PointWithdrawButton>
          <PointDepositButton
            onClick={() => {
              pointChargeHandle();
            }}
            aria-label="충전하기"
          >
            <div>충전하기</div>
          </PointDepositButton>
        </PointDepositWithdrawWrapper>
        <PointHistoryList />
      </PointModalContainer>
    </>
  );
};

const PointModalContainer = styled.div`
  width: 792px;
  height: auto;
  color: ${(props) => props.theme.colors.black};
`;

const PointImgWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  font-size: ${theme.fontSize.title16};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.gray30};
`;

const CurrentPoint = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 48px;
  width: 100%;
  height: 47px;
  color: ${(props) => props.theme.colors.black};
  font-size: ${theme.fontSize.title32};
  font-weight: ${theme.fontWeight.bold};
`;

const PointDepositWithdrawWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  width: 588px;
  height: auto;
  gap: 24px;
`;

const PointWithdrawButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 282px;
  height: 64px;
  font-size: ${theme.fontSize.ad24};
  font-weight: ${theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.orange00};
  color: ${(props) => props.theme.colors.orange02Main};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.orange01};
  }
`;

const PointDepositButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 282px;
  height: 64px;
  font-size: ${theme.fontSize.ad24};
  font-weight: ${theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.orange02Main};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.orange03};
  }
`;

export default PointModal;
