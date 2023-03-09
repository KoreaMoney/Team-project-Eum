import styled from 'styled-components';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { theme } from '../theme';

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
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
  margin-bottom: 180px;
`;
export const PTag = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: 36px;
`;
export const DropDownContainer = styled.div`
  margin: 80px 0;
`;
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
  top: 30px;
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

export const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 240px;
  div {
  }
`;

export const PostContainer = styled.div`
  width: 100%;
  margin-bottom: 56px;
`;

export const PostIMG = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 300px;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
  margin-bottom: 16px;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
  }
`;

export const InfoBest = styled.div`
  text-decoration: underline;
  margin: auto;
  color: ${theme.colors.green};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  margin-bottom: 16px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  &:hover {
    cursor: pointer;
    color: ${theme.colors.orange02Main};
  }
  span {
    display: flex;
    width: 300px;
    height: 40px;
    align-items: center;
    justify-content: center;
    font-size: ${(props) => props.theme.fontSize.title18};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    margin-bottom: 16px;
  }
  p {
    font-size: ${(props) => props.theme.fontSize.title18};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    margin-bottom: 16px;
  }
`;

export const CreateAtText = styled.div``;

export const BottomContainer = styled.div`
  display: flex;
  p {
    font-size: ${(props) => props.theme.fontSize.title16};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: ${(props) => props.theme.lineHeight.title16};
    color: ${(props) => props.theme.colors.gray30};
  }
`;

export const EndPostDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.black};
  height: 100%;
`;
