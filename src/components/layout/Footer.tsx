import styled from 'styled-components';
import { FaGithubSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterDiv>
          <div>웹 소개</div>
          <span>웹 프로젝트 소개</span>
        </FooterDiv>
        <FooterDiv>
          <div>팀 블로그</div>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/KoreaMoney/Final-Project-Client.git"
          >
            <FaGithubSquare size={25} />
          </a>
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
      </FooterWrapper>
      <FooterDiv>
        <NameDiv>
          <div>대표: 김미영 | 디자이너: 김예은</div>

          <TeamMember>팀원: 김도원, 정진수, 김남규</TeamMember>
          <span>주소: 서울특별시 강남구 테헤란로44길</span>
          <span>전화: 1522-8016</span>
        </NameDiv>
      </FooterDiv>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  background-color: #e4e1e1;
  width: 100%;
  height: 9rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 30px;
  color: #757575;
`;
const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 40%;
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
`;
const NameDiv = styled.div`
  margin-bottom: 0.5em;
  align-items: center;
  margin-right: 10px;

  div {
    font-size: 18px;
  }

  span {
    display: flex;
    font-size: 15px;
  }
`;
const TeamMember = styled.p`
  font-size: 13px;
  margin-top: 5px;
  margin-bottom: 10px;
`;
