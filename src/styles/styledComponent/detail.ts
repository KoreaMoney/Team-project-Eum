import styled from 'styled-components';
import { BsHeart, BsShare, BsHeartFill } from 'react-icons/bs';
import { RxClock } from 'react-icons/rx';
import { GoKebabVertical } from 'react-icons/go';
import { NavButtonProps } from '../../types';
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

export const PostImage = styled.div<{ img: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 588px;
  height: 539px;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.img});
  cursor: pointer;
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
    font-size: ${(props) => props.theme.fontSize.title14};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: ${(props) => props.theme.lineHeight.title14};
    color: ${(props) => props.theme.colors.orange02Main};
    text-decoration: underline;
  }
`;

export const InfoTopRightContainer = styled.div`
  display: flex;
  width: 141px;
  justify-content: space-between;
  margin-bottom: 30px;
`;

export const IconLeftContainer = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 100%;
  border: 1px solid ${(props) => props.theme.colors.gray20};
`;

export const HeartIcon = styled(BsHeart)`
  color: ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.title14};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title14};
`;

export const LikeLength = styled.p`
  font-size: ${(props) => props.theme.fontSize.title14};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title14};
  color: ${(props) => props.theme.colors.gray20};
`;

export const ShareIcon = styled(BsShare)`
  color: ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title32};
  position: absolute;
  left: 8px;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;
export const IconRightContainer = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 100%;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const KebobIcon = styled(GoKebabVertical)`
  font-size: 32px;
  cursor: pointer;
`;

export const TitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
  margin-bottom: 24px;
`;

export const PostNickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  color: ${(props) => props.theme.colors.gray30};
  margin-bottom: 195px;
`;

export const PostPrice = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  ${(props) => props.theme.lineHeight.title32};
  line-height: ${(props) => props.theme.lineHeight.title32};
  padding: 40px 0 0 0;
  border-top: 1px solid ${(props) => props.theme.colors.gray20};
`;

export const LikeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 486px;
`;

export const NoLikeButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  background-color: ${(props) => props.theme.colors.white};
  margin-top: 40px;
  border-radius: 10px;
  cursor: pointer;
`;

export const LikeButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border: 1px solid ${(props) => props.theme.colors.orange02Main};
  margin-top: 40px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 10px;
  cursor: pointer;
`;

export const NoLikeIcon = styled(BsHeart)`
  color: ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
`;

export const LikeSubmitButton = styled.button`
  width: 383px;
  height: 64px;
  margin-top: 40px;
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

export const LikeIcon = styled(BsHeartFill)`
  color: ${(props) => props.theme.colors.orange02Main};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
`;

export const NavContainer = styled.div`
  display: flex;
  position: sticky;
  z-index: 5;
  top: 90px;
  width: 1200px;
  height: 80px;
  padding: 30px 0;
  border-top: 1px solid ${(props) => props.theme.colors.gray20};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 60px;
  background-color: ${(props) => props.theme.colors.white};
`;

export const NavButtons = styled.button<NavButtonProps>`
  padding: none;
  background-color: ${(props) => props.theme.colors.white};
  border: none;
  border-right: 1px solid ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  color: ${(props) =>
    props.active ? props.theme.colors.black : props.theme.colors.gray20};
  cursor: pointer;
`;

export const PostContentWrapper = styled.div`
  width: 100%;
`;

export const SellerInfoTitle = styled.div`
  width: 100%;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  padding-bottom: 24px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

export const SellerInfoContent = styled.div`
  margin-top: 32px;
  min-height: 323px;
  p {
    font-size: ${(props) => props.theme.fontSize.title20};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    line-height: 40px;
  }
`;

export const PostRow = styled.div`
  display: flex;
  gap: 24px;
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
export const DropDownContainer = styled.div`
  position: relative;
`;
export const DropDownBox = styled.div`
  width: 132px;
  border-radius: 20%;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  position: absolute;
  background-color: ${(props) => props.theme.colors.white};
  top: 45px;
  right: -110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const DropDownButton = styled.button`
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.title20};
  line-height: 20px;
  border: none;
  background-color: transparent;
  padding: 20px 0;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.orange02Main};
  }
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

export const ClearButton = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 62px;
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
  &:active {
    font-size: ${(props) => props.theme.fontSize.ad24};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    background-color: ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.white};
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 62px;
  border: none;
  background-color: ${(props) => props.theme.colors.orange00};
  color: ${(props) => props.theme.colors.orange02Main};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.orange01};
    color: ${(props) => props.theme.colors.orange02Main};
  }
  &:active {
    background-color: ${(props) => props.theme.colors.orange00};
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 24px;
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
