import styled from 'styled-components';

const UserTime = () => {
  return (
    <TermsContainer>
      <TermsTitle>약관동의</TermsTitle>
      <TermsInfo>
        •ㅤ정보수신동의를 하시면, 고객혜택 및 이벤트 등 다양한 정보를 받으실 수
        있습니다.
      </TermsInfo>
      <MainCheckContainer>
        <CheckInput />
        <CheckMainTitle>(선택) 마케팅 정보 수신 동의</CheckMainTitle>
      </MainCheckContainer>
      <CheckContainer>
        <ChildCheckContainer>
          <CheckInput />
          <CheckContent>SMS</CheckContent>
        </ChildCheckContainer>
        <ChildCheckContainer>
          <CheckInput />
          <CheckContent>이메일</CheckContent>
        </ChildCheckContainer>
      </CheckContainer>
    </TermsContainer>
  );
};
export default UserTime;

const TermsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TermsTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.fontSize.title20};
`;

const TermsInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.gray20};
`;

const MainCheckContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CheckInput = styled.input.attrs({ type: 'checkbox' })`
  width: 24px;
  height: 24px;
  cursor: pointer;
  appearance: none;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 4px;
  position: relative;
  margin: 0;
  &:focus {
    outline: none;
  }

  &:checked {
    background-color: ${(props) => props.theme.colors.orange02Main};
    border: none;
  }

  &:checked::after {
    content: '';
    position: absolute;
    left: 12px;
    top: 40%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
  }
`;

const CheckMainTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.fontSize.title18};
`;

const CheckContainer = styled.div`
  width: 248px;
  display: flex;
  justify-content: space-between;
  gap: 32px;
  margin-left: 40px;
  margin-bottom: 64px;
`;
const ChildCheckContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const CheckContent = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title18};
  color: ${(props) => props.theme.colors.gray20};
`;
