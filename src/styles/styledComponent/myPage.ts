import styled from 'styled-components';
import { theme } from '../theme';
import { AiOutlineRight } from 'react-icons/ai';
export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 360px 240px 360px;
`;

export const MyPageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${theme.fontSize.title32};
  font-weight: ${theme.fontWeight.bold};
  line-height: ${theme.lineHeight.title32};
  width: 100%;
  height: auto;
  margin-top: 60px;
  margin-bottom: 96px;
`;

export const MyPageBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 48px 0 0 102px;
  width: 100%;
  gap: 52px;
`;

export const MyPageNavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 152px;
  gap: 56px;
`;

export const MyTradeNavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
  width: 152px;
  span {
    font-size: ${theme.fontSize.ad24};
    font-weight: ${theme.fontWeight.bold};
  }
  div {
    font-size: ${theme.fontSize.title20};
    font-weight: ${theme.fontWeight.medium};
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.black};
    border: none;
    &:hover {
      cursor: pointer;
      color: ${(props) => props.theme.colors.orange03};
      background-color: ${(props) => props.theme.colors.white};
    }
  }
`;

export const MyInfoNavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: flex-start;
  gap: 32px;
  width: 152px;
  span {
    font-size: ${theme.fontSize.ad24};
    font-weight: ${theme.fontWeight.bold};
  }
  div {
    font-size: ${theme.fontSize.title20};
    font-weight: ${theme.fontWeight.medium};
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.black};
    border: none;
    &:hover {
      cursor: pointer;
      color: ${(props) => props.theme.colors.orange03};
      background-color: ${(props) => props.theme.colors.white};
    }
  }
`;

export const MyPageContentsContainer = styled.div`
  width: 894px;
  height: auto;
  padding-left: 102px;
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
`;

export const MypageCategoryTop = styled.div`
  font-size: ${theme.fontSize.ad24};
  font-weight: ${theme.fontWeight.bold};
  width: 180px;
  height: 24px;
  margin-bottom: 56px;
`;

export const MySellNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 792px;
  height: 48px;
  color: ${theme.colors.gray20};
  font-size: ${theme.fontSize.title20};
  font-weight: ${theme.fontWeight.medium};
  div {
    width: 50%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      color: ${theme.colors.gray40};
      border-bottom: 1px solid ${theme.colors.gray40};
    }
  }
`;

export const MyInfoTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: top;
  height: 24px;
  font-size: ${theme.fontSize.title20};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 24px;
`;

export const MyNickName = styled.p`
  width: 300px !important;
  font-size: ${theme.fontSize.title20};
  font-weight: ${theme.fontWeight.bold};
  line-height: ${theme.fontSize.title20};
  span {
    color: ${theme.colors.orange02Main};
  }
`;

export const MyInfoTopRight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  p {
    font-size: ${theme.fontSize.title18};
    font-weight: ${theme.fontWeight.medium};
    line-height: ${theme.fontSize.title18};
  }
`;

export const RightIcon = styled(AiOutlineRight)`
  width: 18px;
  height: 18px;
`;

export const MyPageContentsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 24px;
  row-gap: 80px;
  width: 792px;
  height: auto;
  padding: 40px 0;
  border-top: 1px solid ${theme.colors.gray20};
  border-bottom: 1px solid ${theme.colors.gray20};
`;

export const MyLikeList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  height: 400px;
  gap: 16px;
  overflow: hidden;
  position: relative;

  p {
    font-size: ${(props) => props.theme.fontSize.title16};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: ${(props) => props.theme.lineHeight.title16};
    color: ${(props) => props.theme.colors.gray20};
    text-align: center;
  }
`;
export const MyLikeDiv = styled.div`
  text-align: center;
  font-size: ${theme.fontSize.title18};
  font-weight: ${theme.fontWeight.medium};
  padding: 0 24px;
`;

export const PostImg = styled.img`
  width: auto;
  height: 200px;
  cursor: pointer;
  &:hover {
    scale: 1.05;
  }
`;

export const LikeImg = styled.img`
  width: auto;
  height: auto;
`;

export const MySellListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 24px;
  row-gap: 80px;
  width: 792px;
  height: auto;
  margin-top: 56px;
  padding: 40px 0;
  border-top: 1px solid ${theme.colors.gray20};
  border-bottom: 1px solid ${theme.colors.gray20};
`;

export const MyInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 590px;
  height: auto;
  font-size: ${theme.fontSize.title20};
  font-weight: ${theme.fontWeight.bold};
`;

export const UserProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rem;

  span {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 2rem;
    width: 18rem;
    font-size: ${theme.fontSize.title16};
    font-weight: ${theme.fontWeight.bold};
  }
`;

export const UserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto 30px auto;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 2rem;
    font-size: ${theme.fontSize.title20};
    font-weight: ${theme.fontWeight.bold};
    border-bottom: 1px solid ${theme.colors.orange02Main};
    &:hover {
      cursor: pointer;
      color: ${(props) => props.theme.colors.gray40};
      border-bottom: 1px solid ${theme.colors.orange03};
    }
  }
  button {
    width: 4rem;
    height: 2rem;
    font-size: ${theme.fontSize.title16};
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

export const EditInputValue = styled.input`
  width: 14rem;
  height: 28px;
  font-size: ${theme.fontSize.title18};
  font-weight: ${theme.fontWeight.medium};
  border: none;
  border-bottom: 1px solid ${theme.colors.orange02Main};
  padding: 0 1rem;
  text-align: left;
  :focus {
    outline: none;
  }
  ::placeholder {
    text-align: left;
    color: ${theme.colors.gray30};
  }
`;

export const UserBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 18rem;
  height: auto;
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray30};
  border: 1px solid ${theme.colors.gray50};
  border-radius: 10px;
  margin-bottom: 2rem;
`;

export const UserSellBuyWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 12px;
    width: 100%;
    height: 320px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.colors.gray10};
    color: ${(props) => props.theme.colors.gray30};
  }
  img {
    height: 100px;
    background-image: url('https://ifh.cc/g/OoQLa8.jpg');
    background-size: cover;
    background-position: center;
  }
`;
export const InfoBest = styled.div`
  text-decoration: underline;
  color: ${theme.colors.green};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

export const CategoryName = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.fontSize.ad24};
  margin-bottom: 56px !important;
`;

export const UserInfoBox = styled.div`
  width: 588px;
  height: 148px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
`;

export const UserInfoTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.gray20};
`;

export const UserInfoContent = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.fontSize.title18};
  padding-bottom: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

export const KakaoIdBox = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

export const KakaoTitle = styled.p`
  position: absolute;
  top: 20px;
  left: 40px;
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.gray30};
`;

export const KakaoInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.gray20};
  margin-left: 5px;
  margin-bottom: 56px;
`;

export const NickNameInfoCheck = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.gray20};
  margin-left: 5px;
  margin-bottom: 56px;
`;

export const NickNameInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.red};
  margin-left: 5px;
  margin-bottom: 56px;
`;

export const NickNameInfoPass = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.green};
  margin-left: 5px;
  margin-bottom: 56px;
`;

export const KakaoId = styled.input`
  width: 588px;
  height: 91px;
  border: 1px solid ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  padding: 48px 40px 16px 40px;
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.fontSize.title18};
  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;

export const UserNickName = styled.input`
  margin-right: 6px;
  width: 491px;
  height: 91px;
  border: 1px solid ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  padding: 48px 40px 16px 40px;
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.fontSize.title18};
  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;

export const UserNickNameBtn = styled.button`
  position: absolute;
  width: 91px;
  height: 91px;
  background-color: ${(props) => props.theme.colors.orange02Main};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;

export const BirthInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.gray20};
  margin: 16px 0 8px 5px;
`;

export const ClearPost = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
  color: ${(props) => props.theme.colors.orange01};
  text-align: center;
  line-height: 355px;
`;
