import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 792px;
  margin: 0 auto;
  margin-top: 96px;
`;

export const ContainerTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
  text-align: center;
`;
export const ReviewOpinionContainer = styled.div`
  p {
    font-size: ${(props) => props.theme.fontSize.ad24};
    font-weight: ${(props) => props.theme.fontWeight.bold};
    line-height: ${(props) => props.theme.lineHeight.ad24};
    margin-bottom: 7px;
  }
`;

export const GridBox = styled.div`
  width: 100%;
  height: 176px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 32px 40px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
`;

export const ProductContainer = styled.div`
  display: flex;
  height: 152px;
  flex-direction: column;
  gap: 16px;
`;
export const ProductTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray20};
`;
export const ProductSeller = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  padding-bottom: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

export const BadgeContainer = styled.div`
  height: 208px;

  p {
    font-size: ${(props) => props.theme.fontSize.title20};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    line-height: ${(props) => props.theme.lineHeight.title20};
    padding-bottom: 16px;
  }
`;

export const BadgeImg = styled.div<{ imageUrl: string | null }>`
  width: 112px;
  height: 112px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
`;

export const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ReviewTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
`;

export const ReviewInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.gray20};
`;

export const ReviewInput = styled.input`
  width: 100%;
  height: 62px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  padding: 16px 40px;
  font-size: ${(props) => props.theme.fontSize.title20};
  line-height: ${(props) => props.theme.lineHeight.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border-radius: 10px;
  &:focus {
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  width: 383px;
  height: 64px;
  border: 1px solid ${(props) => props.theme.colors.orange02Main};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.orange02Main};
  margin: 0 auto;
  margin-bottom: 240px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.white};
  }
  &:active {
    font-weight: ${(props) => props.theme.fontWeight.medium};
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;
