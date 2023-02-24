import styled from 'styled-components';
import { FaGithubSquare } from 'react-icons/fa';
import MoveTop from '../modal/MoveTop';

const Footer = () => {
  const url = 'https://github.com/KoreaMoney/Final-Project-Client.git';

  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterMiniWrapper>
          <FooterDiv>
            <div>웹 소개</div>
            <span>웹 프로젝트 소개</span>
          </FooterDiv>
          <FooterDiv>
            <div>팀 블로그</div>
            <button
              onClick={() => {
                window.open(url);
              }}
              aria-label="깃헙"
            >
              <FaGithubSquare size={30} />
            </button>
          </FooterDiv>
          <FooterDiv>
            <div>고객안내</div>
            <span>이용약관</span>
            <span>이용안내</span>
          </FooterDiv>
          <FooterDiv>
            <div>고객센터</div>
            <span>공지사항</span>
            <span>자주하는 질문</span>
          </FooterDiv>
        </FooterMiniWrapper>
        <FooterDiv>
          <NameDiv>
            <div>대표: 김미영 | 디자이너: 김예은</div>

            <TeamMember>팀원: 김도원, 정진수, 김남규</TeamMember>
            <span>주소: 서울특별시 강남구 테헤란로44길</span>
            <span>전화: 1522-8016</span>
          </NameDiv>
        </FooterDiv>
      </FooterWrapper>
      <MoveTop />
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.brandColor};
  color: ${(props) => props.theme.colors.gray40};
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  width: 70%;
`;

const FooterMiniWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin-top: 2rem;
`;

const FooterDiv = styled.div`
  display: flex;
  flex-direction: column;

  div {
    margin-bottom: 1em;
    font-size: 20px;
    font-weight: 600;
  }

  span {
    margin-bottom: 5px;
  }

  button {
    border: none;
    outline: none;
    background-color: transparent;
    color: ${(props) => props.theme.colors.gray40};

    &:hover {
      color: ${(props) => props.theme.colors.black};
    }
  }
`;

const NameDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-top: 2rem;

  div {
    font-size: ${(props) => props.theme.fontSize.bottom20};
  }

  span {
    font-size: ${(props) => props.theme.fontSize.body16};
  }
`;
const TeamMember = styled.p`
  font-size: ${(props) => props.theme.fontSize.body16};
  margin-top: 5px;
  margin-bottom: 10px;
`;
