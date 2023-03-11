import { theme } from '../../styles/theme';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Error404 = () => {
  const navigate = useNavigate();

  const homeClick = () => {
    navigate('/');
  };

  return (
    <>
      <ErrorContainer>
        <Main>
          <span>앗</span>
          <p>죄송합니다.</p>
          <div>네트워크 에러가 발생하였습니다.</div>
          <Call
            onClick={() => {
              window.open(
                'https://docs.google.com/forms/d/1f8mCjZRdwyyKqEAdie8ZWPh0Vl7_RxpVSB0UtajX1i0/'
              );
            }}
          >
            개발자에게 문의하기
          </Call>
          <button onClick={homeClick} aria-label="홈 화면으로 이동">
            메인페이지로 돌아가기
          </button>
        </Main>
      </ErrorContainer>
    </>
  );
};

export default Error404;

const ErrorContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin-top: 130px;
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  margin: 0 auto;
  span {
    font-size: 150px;
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: 80px;
  }
  p,
  div {
    font-size: ${theme.fontSize.ad24};
    font-weight: ${theme.fontWeight.medium};
    margin-bottom: 10px;
  }
  a {
    &:hover {
      color: ${theme.colors.orange02Main};
    }
  }
  button {
    width: 384px;
    margin-top: 80px;
    height: 64px;
    background-color: ${theme.colors.orange02Main};
    color: ${theme.colors.white};
    font-size: ${theme.fontSize.ad24};
    font-weight: ${theme.fontWeight.medium};
    border-radius: 10px;
    border: none;
    box-shadow: -2px -2px 6px #fff, 5px 5px 10px #babebc;
    &:hover {
      cursor: pointer;
      border: 2px solid ${theme.colors.orange02Main};
      color: ${theme.colors.orange02Main};
      background-color: transparent;
    }
    &:active {
      background-color: ${theme.colors.orange02Main};
      color: ${theme.colors.white};
    }
  }
`;

const Call = styled.div`
  font-size: ${theme.fontSize.title18};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
    color: ${theme.colors.orange02Main};
  }
`;
