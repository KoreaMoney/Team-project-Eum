import styled from 'styled-components';
import { AiFillCloseCircle, AiFillEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { theme } from '../theme';

//회원가입 & 로그인 동일한 스타일
export const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 384px;
  height: 712px;
  margin: 0 auto;
  padding-top: 70px;
`;

export const LoginText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32px;
  margin-bottom: 60px;
  font-size: ${theme.fontSize.title32};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.black};
`;

export const LoginForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 280px;
`;

export const LoginInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 64px;
  padding-left: 32px;
  border: 1px solid ${theme.colors.gray20};
  border-radius: 10px;
  margin-top: 14px;
`;

export const LoginInputText = styled.span`
  font-size: 13px;
  height: 18px;
  width: 120px;
  display: flex;
  align-items: center;
  color: ${theme.colors.gray20};
`;

export const LoginInput = styled.input`
  width: 85%;
  height: 22px;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: ${theme.fontSize.title14};
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.colors.gray20};
    font-size: 12px;
  }
`;

export const LoginMiniWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LoginCloseIcon = styled(AiFillCloseCircle)`
  color: ${(props) => props.theme.colors.gray20};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;

export const LoginPwIcon = styled(AiFillEye)`
  color: ${(props) => props.theme.colors.gray20};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.gray40};
  }
`;

export const SubmitLogin = styled.button`
  width: 100%;
  height: 64px;
  border-radius: 10px;
  margin-top: 15px;
  margin-bottom: 16px;
  background-color: ${theme.colors.orange02Main};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.title16};
  border: none;
  outline: none;
  &:hover {
    cursor: pointer;
    border: 1px solid ${theme.colors.orange02Main};
    background-color: ${theme.colors.white};
    color: ${theme.colors.orange02Main};
  }
`;

export const ErrMsg = styled.div`
  width: 100%;
  padding: 0.4rem;
  padding-left: 1rem;
  font-size: ${theme.fontSize.title14};
  color: ${theme.colors.red};
`;

export const LoginAnd = styled.div`
  font-size: ${theme.fontSize.title14};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.gray30};
  margin-bottom: 16px;
`;

export const GoogleWrapper = styled.div`
  width: 100%;
  height: 64px;
`;

export const GoogleBtn = styled.button`
  width: 100%;
  height: 100%;
  outline: none;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.black};
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    border: 1px solid ${theme.colors.orange02Main};
    color: ${theme.colors.orange02Main};
  }
`;

export const GoogleIconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 23px;
  height: 32px;
  width: 100%;
  p {
    font-size: ${theme.fontSize.title16};
    font-weight: ${theme.fontWeight.medium};
  }
`;
export const GoogleIcon = styled(FcGoogle)`
  margin-right: 47px;
`;

export const LoginOther = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 18px;
  margin-top: 32px;
  button {
    border: none;
    outline: none;
    font-size: ${theme.fontSize.title14};
    background-color: transparent;
    color: ${theme.colors.gray30};
    font-weight: ${theme.fontWeight.medium};

    &:hover {
      cursor: pointer;
      color: ${theme.colors.orange02Main};
      font-weight: ${theme.fontWeight.bold};
    }
  }
`;

//회원가입
export const PassMSG = styled.p`
  color: ${theme.colors.green};
  margin-top: 0.3rem;
  font-size: ${theme.fontSize.title14};
`;

export const SignUpForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 530px;
`;

export const SignUpInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 64px;
  padding-left: 32px;
  border: 1px solid ${theme.colors.gray20};
  border-radius: 10px;
`;

export const SignUpPwWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 64px;
  padding-left: 32px;
  border: 1px solid ${theme.colors.gray20};
  border-radius: 10px;
  margin-top: 40px;
`;

export const SignUpPwCheckWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 64px;
  padding-left: 32px;
  border: 1px solid ${theme.colors.gray20};
  border-radius: 10px;
`;

export const SignUpNickname = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  margin-top: 56px;
`;

export const SignUpNicknameWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 269px;
  height: 100%;
  padding-left: 32px;
  border: 1px solid ${theme.colors.gray20};
  border-radius: 10px;
`;

export const SignUpCheckBtn = styled.button`
  width: 90px;
  height: 100%;
  color: ${theme.colors.orange02Main};
  font-size: ${theme.fontSize.title16};
  font-weight: ${theme.fontWeight.medium};
  border: 1px solid ${theme.colors.orange02Main};
  border-radius: 10px;
  background-color: transparent;
  &:hover {
    cursor: pointer;
    background-color: ${theme.colors.orange02Main};
    color: ${theme.colors.white};
  }
`;

export const SignUpInputNick = styled.input`
  width: 80%;
  height: 22px;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: ${theme.fontSize.title14};
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.colors.gray20};
    font-size: 12px;
  }
`;

export const SignUpBtn = styled.button`
  width: 100%;
  height: 64px;
  border-radius: 10px;
  margin-top: 56px;
  background-color: ${theme.colors.orange02Main};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.title16};
  border: none;
  outline: none;
  &:hover {
    cursor: pointer;
    border: 1px solid ${theme.colors.orange02Main};
    background-color: ${theme.colors.white};
    color: ${theme.colors.orange02Main};
  }
`;
