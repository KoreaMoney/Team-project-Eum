import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfilePoint } from '../../api';
import { CustomModal } from '../modal/CustomModal';
import PointHistoryList from './PointHistoryList';
import styled from 'styled-components';

/**순서
 * 1.
 *
 */
const PointModal = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const { data: profileData } = useQuery(['users'], getProfilePoint);

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
              <CloseButton onClick={onClickToggleModal}>X</CloseButton>
              <PointImgWrapper>
                <img src="/assets/walletmoney.png" alt="지갑" />
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 18rem;
  height: 2rem;
  font-size: 100%;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border: none;
  border-radius: 10px;
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
  font-size: 100%;
`;

const CurrentPoint = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 40px;
  width: 100%;
  height: 80px;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
`;

const PointDepositWithdrawWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
  gap: 24px;
`;

const PointDepositButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 72px;
  font-size: 1rem;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.gray20};
    color: ${(props) => props.theme.colors.gray40};
  }
`;

const PointWithdrawButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 72px;
  font-size: 1rem;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.gray20};
    color: ${(props) => props.theme.colors.gray40};
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
