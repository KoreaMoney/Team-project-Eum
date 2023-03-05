import styled from 'styled-components';
import { theme } from '../theme';

export const Line = styled.div`
  width: 1200px;
  height: 56px;
  border-top: 2px solid ${theme.colors.gray10};
`;

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HomePostContainer = styled.div`
  width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const HotEum = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;

  span {
    font-size: ${(props) => props.theme.fontSize.title32};
    font-weight: ${(props) => props.theme.fontWeight.bold};
    margin-bottom: 20px;
  }
  p {
    font-size: ${(props) => props.theme.fontSize.title16};
    margin-bottom: 15px;
  }
`;

export const PostWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 370px;
  height: 352px;
`;

export const PostImg = styled.div<{ bgPhoto: string }>`
  width: 70%;
  height: 200px;
  margin: auto;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    width: 72%;
    height: 210px;
    box-shadow: 3px 5px 3px ${theme.colors.gray20};
  }
`;

export const PostInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  line-height: 32px;
`;

export const InfoBest = styled.div`
  text-decoration: underline;
  color: ${theme.colors.green};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

export const InfoTitle = styled.span`
  font-size: ${(props) => props.theme.fontSize.title20};
`;

export const InfoProfile = styled.div`
  font-size: ${(props) => props.theme.fontSize.title18};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
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

export const InfoNickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  color: ${theme.colors.gray30};
`;

export const InfoNew = styled.div`
  text-decoration: underline;
  color: ${theme.colors.Blue};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;
