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