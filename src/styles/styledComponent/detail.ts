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
    font-size: 20px;
    background-color: yellow;
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
  font-size: 24px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
`;

export const PostPrice = styled.p`
  width: 100%;
  font-size: 20px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  text-align: right;
`;

export const ProfileIMG = styled.div<{ profileIMG: string }>`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
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
    font-size: 20px;
    background-color: yellow;
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
  font-size: 36px;
  border: 2px solid yellow;
  background-color: ${(props) => props.theme.colors.white};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.gray30};
  }
`;

export const HeartIcon = styled(AiFillHeart)`
  color: tomato;
`;

export const PostContentWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 48%;
  height: 100%;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

export const SellerInfo = styled.div`
  padding: 2rem;
  width: 100%;
  min-height: 20rem;
  border: 2px solid yellow;
  p {
    margin-bottom: 20px;
  }
`;

export const PostRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
