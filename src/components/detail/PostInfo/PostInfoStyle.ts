import styled from 'styled-components';
import { BsHeart, BsShare, BsHeartFill } from 'react-icons/bs';
import { GoKebabVertical } from 'react-icons/go';


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
export const InfoTopRightContainer = styled.div`
  display: flex;
  width: 141px;
  justify-content: space-between;
  margin-bottom: 30px;
`;
export const LikeIconLeftContainer = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 100%;
  border: 1px solid ${(props) => props.theme.colors.orange02Main};
`;

export const HeartIcon = styled(BsHeart)`
  color: ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.title14};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title14};
`;

export const LikeHeartIcon = styled(BsHeart)`
  color: ${(props) => props.theme.colors.orange02Main};
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

export const LikeLikeLength = styled.p`
  font-size: ${(props) => props.theme.fontSize.title14};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title14};
  color: ${(props) => props.theme.colors.orange02Main};
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
export const TitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
  margin-bottom: 24px;
`;
export const DropDownContainer = styled.div`
  position: relative;
`;
export const KebobIcon = styled(GoKebabVertical)`
  font-size: 32px;
  cursor: pointer;
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
export const PostNickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  color: ${(props) => props.theme.colors.gray30};
  margin-bottom: 120px;
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
export const ViewBuyerButton = styled.button`
  width: 485px;
  height: 64px;
  margin-top: 40px;
  margin-bottom: 40px;
  border: none;
  background-color: ${(props) => props.theme.colors.orange02Main};
  color: ${(props) => props.theme.colors.white};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;

export const NotViewBuyerButton = styled.button`
  width: 485px;
  height: 64px;
  margin-top: 40px;
  margin-bottom: 40px;
  border: none;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
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

export const LikeSubmitButton = styled.button`
  width: 383px;
  height: 64px;
  margin-top: 40px;
  margin-bottom: 40px;
  border: none;
  background-color: ${(props) => props.theme.colors.orange02Main};
  color: ${(props) => props.theme.colors.white};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
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

export const NoLikeIcon = styled(BsHeart)`
  color: ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
`;
export const LikeIcon = styled(BsHeartFill)`
  color: ${(props) => props.theme.colors.orange02Main};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
`;
export const CompletedBTContainer = styled.div`
  width: 485px;
  height: 64px;
  background-color: ${(props) => props.theme.colors.gray10};
  
  display: flex;
  gap: 32px;
  align-items: center;
  border-radius: 30px;
  padding: 0 4px;
  `;
export const StateButton = styled.button`
  width: 231px;
  height: 56px;
  border: none;
  background-color: ${(props) => props.theme.colors.orange01};
  border-radius: 30px;
  color: ${(props) => props.theme.colors.orange03};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.25));
  cursor: pointer;
`;
export const NoStateButton = styled.button`
  width: 231px;
  height: 56px;
  border: none;
  background-color: ${(props) => props.theme.colors.gray10};
  border-radius: 30px;
  color: ${(props) => props.theme.colors.gray20};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  cursor: pointer;
`;
