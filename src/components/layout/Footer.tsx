import styled from 'styled-components';
import { theme } from '../../styles/theme';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <LogoImg src="https://ifh.cc/g/TqgLJX.webp" alt="로고" loading='lazy'/>
        <InfoWrapper>
          <EumInfo>
            <p>상표 : 이음</p> &nbsp;| &nbsp;<p>리더 : 김미영</p> &nbsp;| &nbsp;
            <p>디자이너 : 김예은</p> &nbsp;| &nbsp;
            <p>팀원 : 김도원, 김남규, 정진수</p>
          </EumInfo>
          <EumInfo>
            <p>전화 : 1522-8016</p> &nbsp;| &nbsp;
            <p>주소 : 서울특별시 테헤란로 44길 8 12층</p> &nbsp;| &nbsp;
            <p>이메일 : hopeun710@gmail.com</p>
          </EumInfo>
          <EumInfo>
            <p>Copyright 2023&nbsp;ⓒ Yeeun Kim.</p> &nbsp;
            <p>All right reserved.</p>
          </EumInfo>
        </InfoWrapper>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  width: 100vw;
  height: 200px;
  margin-top: 126px;
  background-color: ${theme.colors.gray05};
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 1100px;
  height: 100%;
  margin: 0 auto;
`;

const LogoImg = styled.img`
  margin-bottom: 70px;
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const EumInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  margin-bottom: 21px;
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray30};
`;
