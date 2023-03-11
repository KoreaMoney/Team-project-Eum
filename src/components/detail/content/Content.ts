import styled from 'styled-components';


export const PostRow = styled.div`
  display: flex;
  gap: 24px;
`;

export const SellerInfoTitle = styled.div`
  width: 100%;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  padding-bottom: 24px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

export const SellerInfoContent = styled.div`
  margin-top: 32px;
  min-height: 323px;
  p {
    font-size: ${(props) => props.theme.fontSize.title20};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    line-height: 40px;
  }
`;

export const PostContentWrapper = styled.div`
  width: 100%;
`;
export const KakaoButton = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 24px;
  margin-bottom: 80px;
  border: none;
  background-color: ${(props) => props.theme.colors.orange02Main};
  color: ${(props) => props.theme.colors.white};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;