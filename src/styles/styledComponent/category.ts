import styled from 'styled-components';
import { AiFillHeart } from 'react-icons/ai';

export const PageContainer = styled.div`
  width: 70%;
  margin: 0 auto;
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  p {
    font-size: ${(props) => props.theme.fontSize.title24};
    color: ${(props) => props.theme.colors.gray60};
  }
  button {
    font-size: ${(props) => props.theme.fontSize.body16};
    color: ${(props) => props.theme.colors.gray60};
    background-color: ${(props) => props.theme.colors.brandColor};
    border: none;
    width: 7rem;
    height: 2rem;
    cursor: pointer;
    &:hover {
    }
  }
`;

export const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  div {
  }
`;

export const PostContainer = styled.div`
  max-width: 250px;
  width: 100%;
  margin-bottom: 1rem;
  border: 3px solid ${(props) => props.theme.colors.brandColor};
  cursor: pointer;
  &:hover {
    width: 105%;
  }
`;

export const PostIMG = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 10rem;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 247px;
  padding: 1.5rem 2rem 1rem;
  h2 {
    font-size: ${(props) => props.theme.fontSize.title24};
    font-weight: ${(props) => props.theme.fontWeight.bold};
    color: ${(props) => props.theme.colors.gray60};
    text-shadow: 1px 1px 2px gray;
  }
`;

export const CreateAtText = styled.div`
  font-size: ${(props) => props.theme.fontSize.label12};
  color: ${(props) => props.theme.colors.gray20};
  text-align: right;
  margin: 0.5rem 0;
`;

export const ContentText = styled.div`
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.gray60};
  width: 100%;
  height: 8rem;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  p {
    font-size: ${(props) => props.theme.fontSize.label12};
    color: ${(props) => props.theme.colors.gray20};
  }
`;

export const ProfileIMG = styled.div<{ profileIMG: string | undefined | null }>`
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  p {
    font-size: ${(props) => props.theme.fontSize.body16};
    color: ${(props) => props.theme.colors.gray60};
    font-weight: ${(props) => props.theme.fontWeight.medium};
  }
`;

export const LikeIconContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 0.5rem;
  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: ${(props) => props.theme.fontSize.label12};
    line-height: ${(props) => props.theme.fontSize.title24};
    color: ${(props) => props.theme.colors.gray10};
    height: ${(props) => props.theme.fontSize.title24};
  }
`;

export const LikeIcon = styled(AiFillHeart)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.colors.red};
  font-size: 25px; // props로 변경해야함.
`;

export const EndPostDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
  height: 100%;
`;
