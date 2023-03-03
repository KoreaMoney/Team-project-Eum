import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomModal } from '../modal/CustomModal';
import PointHistoryList from './PointHistoryList';
import styled from 'styled-components';
import { customInfoAlert, customWarningAlert } from '../modal/CustomAlert';
import { getUsers } from '../../api';
import { theme } from '../../styles/theme';

/**순서
 * 1.커스텀 모달을 부른다
 * 2. 포인트 활동 alert를 진행한다
 */
const PointModal = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  // 로그인한 유저 정보를 불러옵니다
  const { data: profileData } = useQuery(['users'], () => getUsers(saveUser));

  // 커스텀모달을 불러옵니다
  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  const pointChargeHandle = () => {
    customInfoAlert('이벤트 기간 동안 지급된 포인트로 활동하세요!');
  };

  const pointWithDrawHandle = () => {
    customWarningAlert(
      '이벤트 기간 종료 후 추가되는 포인트만 출금 가능합니다.'
    );
  };
  return (
    <>
      <PointButton onClick={onClickToggleModal} aria-label="포인트">
        <p>포인트</p>
        <div>
          {profileData?.[0] &&
            profileData?.[0].point &&
            profileData?.[0].point
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
              <CloseButton onClick={onClickToggleModal} aria-label="닫기">
                X
              </CloseButton>
              <PointImgWrapper>
                <img src="/assets/walletmoney.png" alt="지갑" loading="lazy" />
                <div>　내 포인트</div>
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
                <PointDepositWithdrawButton
                  onClick={() => {
                    pointChargeHandle();
                  }}
                  aria-label="충전하기"
                >
                  <img src="/assets/moneysend.png" alt="충전" loading="lazy" />
                  <div>　충전하기</div>
                </PointDepositWithdrawButton>
                <PointDepositWithdrawButton
                  onClick={() => {
                    pointWithDrawHandle();
                  }}
                  aria-label="출금하기"
                >
                  <img
                    src="/assets/emptywalletadd.png"
                    alt="출금"
                    loading="lazy"
                  />
                  <div>　출금하기</div>
                </PointDepositWithdrawButton>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 18rem;
  height: 2rem;
  padding: 0 1rem;
  font-size: ${theme.fontSize.title16};
  font-weight: ${theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.orange01};
  border: 1px solid ${theme.colors.orange01};
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.orange03};
    color: ${(props) => props.theme.colors.white};
  }
`;

const PointModalContainer = styled.div`
  width: 800px;
  height: 800px;
  padding: 10%;
  color: ${(props) => props.theme.colors.black};
`;

const PointImgWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
  font-size: ${theme.fontSize.title20};
  font-weight: ${theme.fontWeight.bold};
`;

const CurrentPoint = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 40px;
  width: 100%;
  height: 80px;
  font-size: ${theme.fontSize.title20};
  border: 1px solid ${theme.colors.gray30};
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray50};
  border-radius: 10px;
`;

const PointDepositWithdrawWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
  gap: 1.5rem;
`;

const PointDepositWithdrawButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 72px;
  font-size: ${theme.fontSize.title16};
  font-weight: ${theme.fontWeight.bold};
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.orange01};
  border: 1px solid ${theme.colors.orange01};
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.orange03};
    color: ${(props) => props.theme.colors.white};
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
