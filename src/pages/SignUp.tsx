import {useState} from 'react';
import styled from 'styled-components';
import {AiFillCloseCircle, AiFillEye, AiFillGithub} from 'react-icons/ai';
import {FcGoogle} from 'react-icons/fc';
import {useNavigate} from 'react-router';
import {useForm, SubmitHandler} from 'react-hook-form';
import {ISignUpForm} from '../types';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {auth} from '../firebase/Firebase';

const SignUp = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  // 비밀번호 눈알 아이콘 클릭 시 type 변경 할 수 있는 함수
  // 비밀번호 , 비밀번호체크랑 따로 구현했습니다.
  const [isViewPW, setIsViewPW] = useState(false);
  const [isViewCheckPW, setIsViewCheckPW] = useState(false);
  const handleClickViewPW = () => {
    setIsViewPW(!isViewPW);
  };
  const handleClickCheckPW = () => {
    setIsViewCheckPW(!isViewCheckPW);
  };

  // 유효성 검사를 위한 코드들
  // 영문+숫자+특수기호 포함 8~20자 비밀번호 정규식
  const passwordRule =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    pw: yup.string().matches(passwordRule).required(),
    checkPw: yup
      .string()
      .oneOf([yup.ref('pw')])
      .required(),
  });
  // react hook form 라이브러리 사용
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
  });

  // input state 관리해주는 함수들
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

  const [checkPw, setCheckPw] = useState('');
  const onChangecheckPwHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCheckPw(e.target.value);
  };

  const onSubmitHandler: SubmitHandler<ISignUpForm> = async () => {
    if (errors.checkPw || errors.email || errors.pw) {
      return;
    } else {
      await createUserWithEmailAndPassword(auth, email, pw)
        .then((userCredential) => {
          console.log('회원가입 성공');

          setEmail('');
          setPw('');
          setCheckPw('');
          setErr('');
        })
        .catch((error) => {
          const errorMessage = error.message;

          if (errorMessage.includes('auth/email-already-in-use')) {
            setErr('이미 가입된 회원입니다.');
            return;
          }
        });
    }
  };

  // 구글, 깃허브 로그인
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const onGoogleClick = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log('user: ', user);
        navigate('/home');
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log('error: ', errorMessage);
        if (
          errorMessage.includes('auth/account-exists-with-different-credential')
        ) {
          setErr('이미 가입된 회원입니다.');
          return;
        }
      });
  };

  const onGithubClick = async () => {
    await signInWithPopup(auth, githubProvider)
      .then((result) => {
        const user = result.user;
        console.log('user: ', user);
        navigate('/home');
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log('error: ', errorMessage);
        if (
          errorMessage.includes('auth/account-exists-with-different-credential')
        ) {
          setErr('이미 가입된 회원입니다.');
          return;
        }
      });
  };

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
                type='email'
                placeholder='이메일'
                {...register('email')}
                style={{borderColor: errors?.email?.message ? 'red' : ''}}
                onChange={onChangeEmailHandler}
                value={email}
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
                placeholder='비밀번호'
                {...register('pw')}
                style={{borderColor: errors?.pw?.message ? 'red' : ''}}
                onChange={onChangePwHandler}
                value={pw}
              />
              {pw ? (
                <ViewIcon
                  onClick={handleClickViewPW}
                  style={{color: isViewPW ? 'black' : '#ddd'}}
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
            </ItemContainer>
            <ItemContainer>
              <InputBox
                type={isViewCheckPW ? 'text' : 'password'}
                placeholder='비밀번호 확인'
                {...register('checkPw')}
                style={{borderColor: errors?.checkPw?.message ? 'red' : ''}}
                onChange={onChangecheckPwHandler}
                value={checkPw}
              />
              {checkPw ? (
                <ViewIcon
                  onClick={handleClickCheckPW}
                  style={{color: isViewCheckPW ? 'black' : '#ddd'}}
                />
              ) : undefined}
              {errors.checkPw && errors.checkPw.type === 'required' && (
                <ErrorMSG>비밀번호를 확인해주세요.</ErrorMSG>
              )}
              {errors.checkPw && errors.checkPw.type === 'oneOf' && (
                <ErrorMSG>비밀번호가 일치하지 않습니다.</ErrorMSG>
              )}
              {err && <ErrorMSG>{err}</ErrorMSG>}
            </ItemContainer>
          </InputContainer>
          <JoinButton>등록하기</JoinButton>
        </FormTag>
        <PTag>SNS 회원가입</PTag>
        <SocialLoginButtonContainer>
          <GoogleIcon onClick={onGoogleClick} />
          <GitIcon onClick={onGithubClick} />
        </SocialLoginButtonContainer>
        <MoveSignInButton onClick={() => navigate('/signin')}>
          이미 회원이신가요?
        </MoveSignInButton>
      </Container>
    </>
  );
};

export default SignUp;

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
  flex-direction: column;
  margin: 6.2rem 0 0 0;
`;

const ItemContainer = styled.div`
  position: relative;
  height: 3.7rem;
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

const JoinButton = styled.button`
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

const MoveSignInButton = styled.button`
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
  bottom: 27px;
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
  bottom: 25px;
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
