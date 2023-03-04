import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <LogoText>이음</LogoText>
        <InfoWrapper>
          <EumInfo>
            <p>상표 : 이음</p> &nbsp;| &nbsp;<p>대표 : 김미영</p> &nbsp;| &nbsp;
            <p>디자이너 : 김예은</p> &nbsp;| &nbsp;
            <p>사업자등록번호 : 783-86-01715</p>
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
  margin-top: 50px;
  width: 100%;
  height: 150px;
  background-color: #f9f9f9;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
  height: 100%;
  margin: 0 auto;
`;

const LogoText = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
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
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray30};
`;
