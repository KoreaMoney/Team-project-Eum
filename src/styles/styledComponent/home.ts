import styled from 'styled-components';
import { AiFillHeart } from 'react-icons/ai';
import { motion } from 'framer-motion';

export const HomeContainer = styled.div`
  overflow: hidden;
  width: 70%;
  margin: 0 auto;
`;

export const SwiperWrapper = styled.div`
  width: 95%;
  height: 16em;
  overflow: hidden;
  padding: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .refresh {
    padding: 10px;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;

export const Img = styled(motion.img)`
  position: absolute;
  width: 70%;
  height: 15rem;
  border-radius: 6px;
`;

export const NextPrevWrapper = styled.div`
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const Prev = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
  align-items: center;
  user-select: none;
  font-size: 20px;
  z-index: 2;
  border-radius: 30px;
  width: 40px;
  height: 40px;
`;

export const Next = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
  align-items: center;
  user-select: none;
  font-size: 20px;
  z-index: 2;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  left: 50%;
`;

export const TotalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  h1 {
    font-size: 20px;
    margin: 3rem 0 1rem;
  }
`;

export const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

export const PostIMG = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 10rem;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const PostContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  border: 3px solid yellow;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 247px;
  padding: 1.5rem 2rem 1rem;
`;

export const TitleText = styled.h2`
  font-size: 24px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
  text-shadow: 1px 1px 2px gray;
`;

export const CreateAtText = styled.div`
  text-align: right;
  margin: 0.5rem 0;
  font-size: 12px;
  color: ${(props) => props.theme.colors.gray20};
`;

export const ContentText = styled.div`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  color: ${(props) => props.theme.colors.gray60};
  width: 100%;
  height: 8rem;
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
    font-size: 12px;
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
    font-size: 12px;
    color: ${(props) => props.theme.colors.gray10};
    height: 24px;
    line-height: 24px;
  }
`;
export const LikeIcon = styled(AiFillHeart)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: tomato;
  font-size: 30px; // props로 변경해야함.
`;
export const PriceText = styled.p`
  font-size: 20px;
  color: ${(props) => props.theme.colors.gray60};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;
