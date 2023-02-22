import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate, useLocation } from 'react-router';
import { AiFillCloseCircle, AiFillEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { IoIosGitMerge } from 'react-icons/io';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth } from '../firebase/Firebase';
import { ISignUpForm, userType } from '../types';
import { CustomModal } from '../components/modal/CustomModal';
import FindPW from '../components/auth/FindPW';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import styled from 'styled-components';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [isViewPW, setIsViewPW] = useState(false);
  const [err, setErr] = useState('');
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  /**순서
   * user섹션 저장하기
   * 새로운 유저 정보 받기
   * 이메일
   * 비밀번호
   * 유효성검사
   * 소셜로그인
   * 비밀번호 찾기
   */

  //user섹션에 데이터 저장하기
  useEffect(() => {
    const authObserver = auth.onAuthStateChanged((user) => {
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('user');
      }
    });

    return () => authObserver();
  }, []);

  //새로운 유저 정보 post하기
  const mutation = useMutation((newUser: userType) => {
    return axios
      .post('http://localhost:4000/users', newUser)
      .then((response: AxiosResponse) => {
        return response;
      });
  });

  // uid 중복검사
  const { data } = useQuery(['users'], async () => {
    const response = await axios.get('http://localhost:4000/users');
    return response.data;
  });

  //새로 고침 진행 시 uid session저장하기
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //이메일 작성
  const onChangeEmailHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(e.target.value);
  };

  // x 버튼 누르면 email input 초기화
  const handleInputValueClickBT = () => {
    setEmail('');
  };

  //비밀번호 확인
  const handleClickViewPW = () => {
    setIsViewPW(!isViewPW);
  };
  const passwordRule =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    pw: yup.string().matches(passwordRule).required(),
  });

  //비밀번호 유효성 검사
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
  });

  //비밀번호 작성
  const onChangePwHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPw(e.target.value);
  };

  //이메일 비밀번호 최종 유효성 검사
  const onSubmitHandler: SubmitHandler<ISignUpForm> = async () => {
    if (errors.checkPw || errors.email) {
      return;
    } else {
      setAuthenticating(true);
      await signInWithEmailAndPassword(auth, email, pw)
        .then((userCredential) => {
          navigate(location.state?.from ? location.state.from : '/');
        })
        .catch((error) => {
          setAuthenticating(false);
          const errorMessage = error.message;
          if (errorMessage.includes('user-not-found')) {
            setErr('가입된 회원이 아닙니다.');

            return;
          } else if (errorMessage.includes('wrong-password')) {
            setErr('비밀번호가 일치하지 않습니다.');
          }
        });
    }
  };

  // 소셜 로그인 (구글)
  const googleProvider = new GoogleAuthProvider();

  const onGoogleClick = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        navigate('/');
        const user = result.user;
        const uid = auth.currentUser?.uid;
        const idList = data?.map((user: userType) => user.id); //리팩토링 필요
        const isId = idList.includes(saveUser.uid);
        if (!isId) {
          mutation.mutate({
            id: uid,
            nickName: auth.currentUser?.displayName,
            point: '0',
            contactTime: '',
            profileImg: null,
            like: [],
            isDoneCount: 0,
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (
          errorMessage.includes('auth/account-exists-with-different-credential')
        ) {
          setErr('이미 가입된 회원입니다.');
          navigate('/');
          return;
        }
      });
  };

  //enter로 form제출 가능하게 하기
  const handleOnKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmitHandler)(e);
    }
  };

  // 비밀번호 찾기 모달
  const [isModalActive, setIsModalActive] = useState(false);
  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  return (
    <>
      <Container>
        <div>
          <MainText>
            세상 모든 재능을 이어주다
            <span>우리가 별거아니라고 생각한 재능들을 가치있게 만드세요</span>
            <div>
              <IoIosGitMerge />
              eum
            </div>
          </MainText>
        </div>
        <FormTag onSubmit={handleSubmit(onSubmitHandler)}>
          <InputContainer>
            <ItemContainer>
              <InputBox
                type="email"
                placeholder="이메일"
                {...register('email')}
                style={{ borderColor: errors?.email?.message ? '#FF0000' : '' }}
                onChange={onChangeEmailHandler}
                value={email}
                onKeyDown={handleOnKeyPress}
              />
              {email ? (
                <CloseIcon onClick={handleInputValueClickBT} />
              ) : undefined}
              {errors.email && errors.email.type === 'required' && (
                <ErrorMSG>이메일을 입력해주세요.</ErrorMSG>
              )}
              {errors.email && errors.email.type === 'email' && (
                <ErrorMSG>이메일 형식을 입력해주세요.</ErrorMSG>
              )}
            </ItemContainer>
            <ItemContainer>
              <InputBox
                type={isViewPW ? 'text' : 'password'}
                placeholder="비밀번호"
                {...register('pw')}
                style={{ borderColor: errors?.pw?.message ? '#FF0000' : '' }}
                onChange={onChangePwHandler}
                value={pw}
                onKeyDown={handleOnKeyPress}
              />
              {pw ? (
                <ViewIcon
                  onClick={handleClickViewPW}
                  style={{ color: isViewPW ? '#000' : '#ddd' }}
                />
              ) : undefined}
              {errors.pw && errors.pw.type === 'required' && (
                <ErrorMSG>비밀번호를 입력해주세요.</ErrorMSG>
              )}
              {errors.pw && errors.pw.type === 'matches' && (
                <ErrorMSG>
                  비밀번호는 영문+숫자+특수문자 포함하여 8자 이상이여야 합니다.
                </ErrorMSG>
              )}
              <ErrorMSG>{err}</ErrorMSG>
            </ItemContainer>
          </InputContainer>
          <LoginButton type="submit">로그인 하기</LoginButton>
        </FormTag>
        <PTag>SNS 로그인</PTag>
        <SocialLoginButtonContainer>
          <button onClick={onGoogleClick}>
            <GoogleIcon />
            구글 로그인 하기
          </button>
        </SocialLoginButtonContainer>
        <MoveSignUpButton onClick={() => navigate('/signup')}>
          아직 회원이 아니신가요?
        </MoveSignUpButton>
        <PwLossButtonContainer>
          <PwLossButton onClick={onClickToggleModal}>
            비밀번호를 잊으셨나요?
          </PwLossButton>
        </PwLossButtonContainer>
        {isModalActive ? (
          <CustomModal
            modal={isModalActive}
            setModal={setIsModalActive}
            width="600"
            height="300"
            element={
              <div>
                <FindPW />
              </div>
            }
          />
        ) : (
          ''
        )}
      </Container>
    </>
  );
};

export default SignIn;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 27rem;
  margin: 0 auto;
`;

const MainText = styled.div`
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

const FormTag = styled.form`
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;

const ItemContainer = styled.div`
  position: relative;
  height: 3rem;
`;

const InputBox = styled.input`
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

const CloseIcon = styled(AiFillCloseCircle)`
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

const ViewIcon = styled(AiFillEye)`
  position: absolute;
  bottom: 10px;
  right: 18px;
  font-size: ${(props) => props.theme.fontSize.like30};
  cursor: pointer;
`;

const ErrorMSG = styled.p`
  padding: 0.2rem;
  color: ${(props) => props.theme.colors.red};
  font-size: ${(props) => props.theme.fontSize.label12};
`;

const LoginButton = styled.button`
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

const PTag = styled.span`
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.gray30};
  margin-top: 2rem;
`;

const SocialLoginButtonContainer = styled.div`
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

const GoogleIcon = styled(FcGoogle)`
  font-size: 2rem;
`;

const MoveSignUpButton = styled.button`
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

const PwLossButtonContainer = styled.div`
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

const PwLossButton = styled.button`
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
