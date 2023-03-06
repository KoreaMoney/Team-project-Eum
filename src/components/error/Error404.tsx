import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const Error404 = () => {
  const navigate = useNavigate();

  const homeClick = () => {
    navigate('/');
  };

  return (
    <ErrorContainer>
      <Main>
        <span>404 ERROR</span>
        <p>죄송합니다. 페이지를 찾을 수 없습니다.</p>
        <p>존재하지 않는 주소를 입력하셨거나</p>
        <p>요청하신 페이지의 주소가 변경,삭제되어 찾을 수 없습니다.</p>
        <button onClick={homeClick}>홈으로</button>
      </Main>
    </ErrorContainer>
  );
};

export default Error404;

const ErrorContainer = styled.div`
  background-image: url('https://ifh.cc/g/sX8ZQV.webp');
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: 0 auto;
  margin-top: 12rem;
  span {
    font-size: ${theme.fontSize.ad56};
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: 20px;
  }
  p {
    font-size: ${theme.fontSize.title20};
    font-weight: ${theme.fontWeight.medium};
    margin-bottom: 10px;
  }
  button {
    width: 40%;
    margin-top: 10px;
    height: 40px;
    background-color: ${theme.colors.black};
    color: ${theme.colors.white};
    font-size: ${theme.fontSize.title16};
    font-weight: ${theme.fontWeight.medium};
    border-radius: 23px;
    border: none;
    box-shadow: -2px -2px 6px #fff, 5px 5px 10px #babebc;
    &:hover {
      cursor: pointer;
      border: 2px solid ${theme.colors.black};
      color: ${theme.colors.black};
      font-weight: ${theme.fontWeight.bold};
      background-color: transparent;
    }
    &:active {
      background-color: ${theme.colors.black};
      color: ${theme.colors.white};
      font-size: ${theme.fontSize.title16};
      font-weight: ${theme.fontWeight.medium};
    }
  }
`;
