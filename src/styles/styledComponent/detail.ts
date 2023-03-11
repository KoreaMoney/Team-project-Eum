import styled from 'styled-components';
import { RxClock } from 'react-icons/rx';

import { theme } from '../theme';

export const DetailContainer = styled.div`
  width: 100vw;
  margin-top: 90px;
`;

export const DetailWrapper = styled.div`
  width: 1200px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

export const PostContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin-bottom: 64px;
`;

export const PostInfoWrapper = styled.div`
  width: 486px;
  height: 539px;
`;

export const InfoTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const InfoTopLeftContainer = styled.div`
  display: flex;
  width: 78px;
  height: 58px;
  margin-bottom: 30px;
  align-items: flex-end;
  p {
    font-size: ${(props) => props.theme.fontSize.title20};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: ${(props) => props.theme.lineHeight.title14};
    color: ${(props) => props.theme.colors.orange02Main};
    text-decoration: underline;
  }
`;

export const ProfileContainer = styled.div`
  width: 100%;
  height: 155px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};

  p {
    width: 100%;
    text-align: left;
  }
`;

export const Profiles = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;
export const NickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
`;

export const ClockIconContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
`;

export const ClockIcon = styled(RxClock)`
  color: ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.regular};
`;

export const BadgeTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray20};
`;

export const ProfileIMG = styled.div<{ profileIMG: string }>`
  width: 96px;
  height: 96px;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;
export const SellerInfoContainer = styled.div`
  height: 235px;
  width: 100%;
`;
export const ProfileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;
export const ProfileInfos = styled.div`
  width: 100%;
  text-align: center;
  border-right: 1px solid ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

export const TransactionText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(255, 231, 221, 0.6);

  h1 {
    font-size: ${(props) => props.theme.fontSize.title64};
    font-weight: ${(props) => props.theme.fontWeight.bold};
    line-height: ${(props) => props.theme.lineHeight.title64};
    color: ${(props) => props.theme.colors.black};
    margin-bottom: 100px;
  }

  button {
    position: absolute;
    top: 10rem;
    bottom: 0;
    background-color: transparent;
    border: none;
    color: ${(props) => props.theme.colors.black};
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colors.orange02Main};
    }
  }
`;

export const KakaoButton = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 24px;
  margin-bottom: 80px;
  border: none;
  background-color: ${(props) => props.theme.colors.orange02Main};
  color: ${(props) => props.theme.colors.white};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;

export const KakoDiv = styled.div`
  background-color: ${theme.colors.white};
  position: absolute;
  z-index: 2;
  height: 100px;
  width: 49%;
`;
