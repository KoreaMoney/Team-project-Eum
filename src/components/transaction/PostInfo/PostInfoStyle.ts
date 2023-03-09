import styled from 'styled-components';

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 24px;
`;

export const ClearButton = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 62px;
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
  &:active {
    font-size: ${(props) => props.theme.fontSize.ad24};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    background-color: ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.white};
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 62px;
  border: none;
  background-color: ${(props) => props.theme.colors.orange00};
  color: ${(props) => props.theme.colors.orange02Main};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.orange01};
    color: ${(props) => props.theme.colors.orange02Main};
  }
  &:active {
    background-color: ${(props) => props.theme.colors.orange00};
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;
