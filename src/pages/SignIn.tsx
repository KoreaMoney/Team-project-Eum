import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiFillCloseCircle, AiFillEye, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, useLocation } from 'react-router';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import { ISignUpForm, userType } from '../types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CustomModal } from '../components/modal/CustomModal';
import FindPW from '../components/auth/FindPW';
import axios, { AxiosResponse } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

const SignIn = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const [checkID, setCheckID] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
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
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  console.log('user: ', user);
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

  

  const [isViewPW, setIsViewPW] = useState(false);
  const handleClickViewPW = () => {
    setIsViewPW(!isViewPW);
  };

  const passwordRule =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    pw: yup.string().matches(passwordRule).required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
  });

  const [email, setEmail] = useState('');
  const onChangeEmailHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(e.target.value);
  };
  
  // x 버튼 누르면 email input 초기화
  const handleInputValueClickBT = () => {
    setEmail('');
  };

  const [pw, setPw] = useState('');
  const onChangePwHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPw(e.target.value);
  };

  const onSubmitHandler: SubmitHandler<ISignUpForm> = async () => {
    if (errors.checkPw || errors.email) {
      return;
    } else {
      await signInWithEmailAndPassword(auth, email, pw)
        .then((userCredential) => {
          navigate(location.state?.from ? location.state.from : '/');
        })
        .catch((error) => {
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

  // 구글, 깃허브 로그인
  const googleProvider = new GoogleAuthProvider();

  const onGoogleClick = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
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
            like: [],
            isDoneCount: 0,
          });
          console.log('데이터 추가: ');
        } else {
          console.log('데이터 추가XX: ');
        }
        navigate('/');
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (
          errorMessage.includes('auth/account-exists-with-different-credential')
        ) {
          setErr('이미 가입된 회원입니다.');
          return;
        }
      });
  };
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
        <InfoBox>
          <InfoText>당신 곁의 개인 비서</InfoText>
          <InfoText>Daylog</InfoText>
        </InfoBox>
        <FormTag onSubmit={handleSubmit(onSubmitHandler)}>
        <InputContainer>
          <ItemContainer>
            <InputBox
              type="email"
              placeholder="이메일"
              {...register('email')}
              style={{ borderColor: errors?.email?.message ? 'red' : '' }}
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
              style={{ borderColor: errors?.pw?.message ? 'red' : '' }}
              onChange={onChangePwHandler}
              value={pw}
              onKeyDown={handleOnKeyPress}
            />
            {pw ? (
              <ViewIcon
                onClick={handleClickViewPW}
                style={{ color: isViewPW ? 'black' : '#ddd' }}
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
        <LoginButton type='submit'>
          계속하기
        </LoginButton>
        </FormTag>
        <PTag>SNS 로그인</PTag>
        <SocialLoginButtonContainer>
          <GoogleIcon onClick={onGoogleClick} />
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
              <ComponentSpace>
                <FindPW />
              </ComponentSpace>
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

const ComponentSpace = styled.div`
  color: black;
`;
const ErrorMSG = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const FormTag = styled.form`
  width: 100%;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 25.7rem;
  margin: 0 auto;
`;

const InfoBox = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  padding: 0.2rem 0;
`;

const InfoText = styled.p`
  font-size: 1.4rem;
  text-align: center;
  margin: 1rem;
  color: #878787;
  cursor: default;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
  margin: 6.2rem 0 0 0;
`;

const ItemContainer = styled.div`
  position: relative;
  height: 2.8rem;
`;

const InputBox = styled.input`
  width: 100%;
  height: 2.4rem;
  padding: 0 3rem 0 1rem;
  font-size: 1rem;
  background-color: #fafafa;
  border: 1.3px solid #ddd;
  border-radius: 8px;
  &::placeholder {
    color: #d1d1d1;
  }
  &:focus {
    outline: none;
  }
`;

const PwLossButton = styled.button`
  margin-top: 0.3rem;
  border: none;
  background-color: white;
  color: #bbbbbb;
  padding: 0;
  cursor: pointer;
  &:hover {
    color: blue;
  }
`;

const PwLossButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 23.5rem;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.1rem;
  background-color: #e4e4e4;
  margin: 4rem 0 2.5rem 0;
  cursor: pointer;
  &:hover {
    background-color: #e1e1e1;
  }
`;

const PTag = styled.p`
  font-size: 0.8rem;
  color: #bbbbbb;
`;

const SocialLoginButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const MoveSignUpButton = styled.button`
  border: none;
  background-color: white;
  color: #bbbbbb;
  padding: 0;
  margin-top: 3rem;
  cursor: pointer;
  &:hover {
    color: blue;
  }
`;

// ICON
const CloseIcon = styled(AiFillCloseCircle)`
  position: absolute;
  bottom: 13px;
  right: 20px;
  font-size: 26px;
  color: #ddd;
  cursor: pointer;
  &:hover {
    color: #d1d1d1;
  }
`;

const ViewIcon = styled(AiFillEye)`
  position: absolute;
  bottom: 10px;
  right: 18px;
  font-size: 30px;
  color: #ddd;
  cursor: pointer;
  &:hover {
    color: #d1d1d1;
  }
`;

const GoogleIcon = styled(FcGoogle)`
  font-size: 4rem;
  cursor: pointer;
`;

const GitIcon = styled(AiFillGithub)`
  font-size: 4rem;
  cursor: pointer;
`;
