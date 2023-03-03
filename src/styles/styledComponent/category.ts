import styled from 'styled-components';
import { AiFillHeart } from 'react-icons/ai';
import {HiOutlineChevronDown} from 'react-icons/hi'

export const PageContainer = styled.div`
  width: 1200px;
  margin: 0 auto;
`;

export const CategoryIntroTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title64};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title64};
  margin-top: 80px;
`;
export const CategoryIntroContentContainer = styled.p`
  padding: 40px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20}; ;
`;
export const PTag = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.reqular};
  line-height: 36px;
`;
export const DropDownContainer = styled.div`
margin: 80px 0;
`
export const SortBarContainer = styled.div`
  display: flex;
  justify-content: right;
  position: relative;
  cursor: pointer;
`;
export const SortBar = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: 20px;
`;
export const DropDownIcon = styled(HiOutlineChevronDown)`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: 20px;
  margin: 0 10px;
  `;

export const DropDownBox = styled.div`
  width: 132px;
  border-radius: 20%;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  position: absolute;
  background-color: ${(props) => props.theme.colors.white};
  top:30px;
  right:-110px;
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
    color: ${(props) => props.theme.colors.orange01};
  }
`;

export const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap:24px;
  margin-bottom: 240px;
  div {
  }
`;

export const PostContainer = styled.div`
  width: 100%;
  margin-bottom: 56px;
  cursor: pointer;
`;

export const PostIMG = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 224px;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  p {
    font-size: ${(props) => props.theme.fontSize.title18};
    font-weight: ${(props) => props.theme.fontWeight.reqular};
    margin-bottom:16px;
  }
`;

export const CreateAtText = styled.div`
  
`;

// export const ContentText = styled.div`
//   font-size: 16px;
//   color: ${(props) => props.theme.colors.gray60};
//   width: 100%;
//   height: 8rem;
//   display: -webkit-box;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   -webkit-line-clamp: 8;
//   -webkit-box-orient: vertical;
// `;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;

  p {
    font-size: ${(props) => props.theme.fontSize.title16};
    font-weight: ${(props) => props.theme.fontWeight.reqular};
    line-height: ${(props) => props.theme.lineHeight.title16};
    color: ${(props) => props.theme.colors.gray20};
  }
`;

// export const LeftContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   p {
//     font-size: 12px;
//     color: ${(props) => props.theme.colors.gray20};
//   }
// `;

// export const ProfileIMG = styled.div<{ profileIMG: string | undefined | null }>`
//   width: 1.7rem;
//   height: 1.7rem;
//   border-radius: 100%;
//   background-image: url(${(props) => props.profileIMG});
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: cover;
// `;

// export const RightContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   p {
//     font-size: 16px;
//     color: ${(props) => props.theme.colors.gray60};
//     font-weight: ${(props) => props.theme.fontWeight.medium};
//   }
// `;

// export const LikeIconContainer = styled.div`
//   position: relative;
//   display: inline-block;
//   margin-right: 0.5rem;
//   span {
//     position: absolute;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//     font-size: 12px;
//     line-height: 24px;
//     color: ${(props) => props.theme.colors.gray10};
//     height: 24px;
//   }
// `;

// export const LikeIcon = styled(AiFillHeart)`
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
//   color: tomato;
//   font-size: 25px; // props로 변경해야함.
// `;

export const EndPostDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
  height: 100%;
`;
