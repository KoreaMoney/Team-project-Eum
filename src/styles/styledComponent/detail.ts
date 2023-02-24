import styled from 'styled-components';
import { AiFillHeart } from 'react-icons/ai';

export const DetailContainer = styled.div`
  width: 60%;
  margin: 0 auto;
`;

export const EditBtnWrapper = styled.div`
  display: flex;
  justify-content: right;
  gap: 0.5rem;
  margin: 1rem 0;

  button {
    width: 5rem;
    height: 2.5rem;
    border: none;
    font-size: ${(props) => props.theme.fontSize.bottom20};
    background-color: ${(props) => props.theme.colors.brandColor};
    cursor: pointer;
    &:hover {
      box-shadow: 1px 1px 3px ${(props) => props.theme.colors.gray20};
    }
  }
`;

export const PostContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4rem;
  margin-bottom: 24px;
`;

export const PostImage = styled.div<{ img: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 490px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.gray10};
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.img});
`;

export const PostInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  height: 490px;
`;

export const TitleText = styled.h2`
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
`;

export const PostPrice = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontSize.bottom20};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  text-align: right;
`;

export const SellerText = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;

export const SellerProfileContainer = styled.div`
  width: 100%;
  height: 240px;
  box-shadow: 1px 1px 5px ${(props) => props.theme.colors.gray20};
`;

export const SellerWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  background-color: rgba(255, 218, 24, 0.8);
`;

export const SellerLeft = styled.div`
  position: relative;
  width: 30%;
`;

export const ProfileIMG = styled.div<{ profileIMG: string }>`
  position: absolute;
  width: 100px;
  height: 100px;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const SellerRight = styled.div`
  display: flex;
  align-items: flex-end;
  width: 70%;
  margin-bottom: 0.5rem;
  p {
    font-size: ${(props) => props.theme.fontSize.bottom20};
  }
`;

export const SellerProfileWrapper = styled.div`
  width: 100%;
  height: 11rem;
`;

export const BottomTopContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: flex-start;
  height: 50%;
`;

export const ContactTimeContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 0.7rem 1.5rem;
  gap: 0.5rem;
  p {
    font-size: ${(props) => props.theme.fontSize.bottom20};
  }
  span {
    font-size: ${(props) => props.theme.fontSize.label12};
    color: ${(props) => props.theme.colors.gray20};
  }
`;

export const DetailBottomWrapper = styled.div`
  height: 50%;
`;

export const ProfileButtonContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  button {
    width: 100%;
    height: 64px;
    font-size: ${(props) => props.theme.fontSize.body16};
    background-color: ${(props) => props.theme.colors.brandColor};
    border: none;
    &:hover {
      box-shadow: 2px 2px 4px ${(props) => props.theme.colors.gray20};
    }
  }
`;

export const LikeAndSubmitContainer = styled.div`
  display: flex;
  gap: 3rem;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4rem;
    color: ${(props) => props.theme.colors.gray40};
    font-size: ${(props) => props.theme.fontSize.bottom20};
    background-color: ${(props) => props.theme.colors.brandColor};
    border: none;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      box-shadow: 1px 1px 3px ${(props) => props.theme.colors.gray20};
    }
  }
`;

export const PostLikeButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14%;
  height: 65px;
  font-size: ${(props) => props.theme.fontSize.title36};
  border: 2px solid ${(props) => props.theme.colors.brandColor};
  background-color: ${(props) => props.theme.colors.white};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.gray30};
  }
`;

export const HeartIcon = styled(AiFillHeart)`
  color: ${(props) => props.theme.colors.red};
`;

export const PostContentWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  gap: 2.5rem;
  margin-bottom: 24px;
  div {
    padding: 2rem;
    width: 100%;
    min-height: 20rem;
    border: 2px solid ${(props) => props.theme.colors.brandColor};
  }
`;
