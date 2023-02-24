import styled from 'styled-components';
import { AiFillCloseCircle, AiFillEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

//회원가입 & 로그인 동일한 스타일
export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 27rem;
  margin: 0 auto;
`;

export const AuthName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 12rem;
  gap: 1.5rem;
  font-size: ${(props) => props.theme.fontSize.like30};
  cursor: default;
  span {
    font-size: ${(props) => props.theme.fontSize.body16};
  }
`;

export const FormTag = styled.form`
  width: 100%;
`;

export const ItemContainer = styled.div`
  position: relative;
  height: 3rem;
`;

export const InputBox = styled.input`
  width: 100%;
  height: 2.6rem;
  font-size: 1rem;
  padding: 0.7rem;
  box-shadow: 0.5px 1px 2px 0.5px ${(props) => props.theme.colors.gray20};
  background-color: ${(props) => props.theme.colors.white};
  border: 2px solid ${(props) => props.theme.colors.brandColor};
  border-radius: 10px;
  &::placeholder {
    color: ${(props) => props.theme.colors.gray20};
  }
  &:focus {
    outline: none;
  }
`;

export const CloseIcon = styled(AiFillCloseCircle)`
  position: absolute;
  right: 1rem;
  top: 0.55rem;
  font-size: ${(props) => props.theme.fontSize.title24};
  color: ${(props) => props.theme.colors.gray20};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.gray40};
  }
`;

export const ViewIcon = styled(AiFillEye)`
  position: absolute;
  bottom: 10px;
  right: 18px;
  font-size: ${(props) => props.theme.fontSize.like30};
  cursor: pointer;
`;

export const ErrorMSG = styled.p`
  padding: 0.2rem;
  color: ${(props) => props.theme.colors.red};
  font-size: ${(props) => props.theme.fontSize.label12};
`;

//회원가입 스타일
export const SignUpInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 12rem;
  width: 100%;
  gap: 1rem;
`;

export const CheckBT = styled.button`
  position: absolute;
  border: none;
  width: 20%;
  height: 2rem;
  right: 0.3rem;
  top: 0.32rem;
  border-radius: 6px;
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.gray30};
  background-color: ${(props) => props.theme.colors.brandColor};
  cursor: pointer;
  &:hover {
    border: 3px solid ${(props) => props.theme.colors.button};
    color: ${(props) => props.theme.colors.black};
  }
`;

export const MoveSignInButton = styled.button`
  border: none;
  background-color: white;
  color: ${(props) => props.theme.colors.gray30};
  font-size: ${(props) => props.theme.fontSize.body16};
  margin-top: 1rem;
  cursor: pointer;
  transition: color 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.colors.button};
    font-weight: ${(props) => props.theme.fontWeight.medium};
  }
`;

export const PassMSG = styled.p`
  color: green;
  margin-top: 0.3rem;
  font-size: ${(props) => props.theme.fontSize.label12};
`;

export const JoinButton = styled.button`
  width: 100%;
  height: 3rem;
  border-radius: 10px;
  margin-top: 2rem;
  color: ${(props) => props.theme.colors.gray30};
  font-size: ${(props) => props.theme.fontSize.bottom20};
  background-color: ${(props) => props.theme.colors.brandColor};
  border: none;
  cursor: pointer;
  &:hover {
    border: 4px solid ${(props) => props.theme.colors.button};
    color: ${(props) => props.theme.colors.black};
  }
  &:active {
    background-color: ${(props) => props.theme.colors.white};
  }
`;

//로그인 스타일

export const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 3rem;
  border-radius: 10px;
  margin-top: 1rem;
  color: ${(props) => props.theme.colors.gray40};
  font-size: ${(props) => props.theme.fontSize.bottom20};
  background-color: ${(props) => props.theme.colors.brandColor};
  border: none;
  cursor: pointer;
  &:hover {
    border: 4px solid ${(props) => props.theme.colors.button};
    color: ${(props) => props.theme.colors.black};
  }
  &:active {
    background-color: ${(props) => props.theme.colors.white};
  }
`;

export const PTag = styled.span`
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.gray30};
  margin-top: 2rem;
`;

export const SocialContainer = styled.div`
  width: 100%;
  gap: 1rem;
  margin-top: 1rem;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 3rem;
    border: none;
    outline: none;
    border-radius: 10px;
    gap: 1rem;
    font-size: ${(props) => props.theme.fontSize.bottom20};
    color: ${(props) => props.theme.colors.gray40};
    background-color: ${(props) => props.theme.colors.brandColor};
    cursor: pointer;
    &:hover {
      border: 4px solid ${(props) => props.theme.colors.button};
      color: ${(props) => props.theme.colors.black};
    }
    &:active {
      background-color: ${(props) => props.theme.colors.white};
    }
  }
`;

export const GoogleIcon = styled(FcGoogle)`
  font-size: 2rem;
`;

export const MoveSignUpButton = styled.button`
  border: none;
  background-color: white;
  color: ${(props) => props.theme.colors.gray30};
  font-size: ${(props) => props.theme.fontSize.body16};
  margin-top: 1rem;
  cursor: pointer;
  transition: color 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.colors.button};
    font-weight: ${(props) => props.theme.fontWeight.medium};
  }
`;

export const PwLossButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 23rem;
  cursor: pointer;
  transition: color 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.colors.button};
    font-weight: ${(props) => props.theme.fontWeight.medium};
  }
`;

export const PwLossButton = styled.button`
  margin-top: 0.3rem;
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.colors.gray30};
  font-size: ${(props) => props.theme.fontSize.body16};
  cursor: pointer;
  transition: color 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.colors.button};
    font-weight: ${(props) => props.theme.fontWeight.medium};
  }
`;
