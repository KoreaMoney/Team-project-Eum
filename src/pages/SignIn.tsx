import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate, useLocation } from 'react-router';
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
import * as a from '../styles/styledComponent/auth';
import { getAuthUsers, postUsers } from '../api';

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
    return postUsers(newUser).then((response: AxiosResponse) => {
      return response;
    });
  });

  // uid 중복검사
  const { data } = useQuery(['users'], getAuthUsers);

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
        const uid = auth?.currentUser?.uid;
        const idList = data?.map((user: userType) => user.id); //리팩토링 필요
        const isId = idList.includes(saveUser?.uid);

        if (!isId) {
          mutation.mutate({
            id: uid,
            nickName: auth.currentUser?.displayName,
            point: 10000000,
            contactTime: '',
            profileImg: null,
            like: [],
            isDoneCount: 0,
          });
        }
        navigate('/');
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
    <a.AuthContainer>
      <div>
        <a.AuthName>
          세상 모든 재능을 이어주다
          <span>우리가 별거아니라고 생각한 재능들을 가치있게 만드세요</span>
          <div>
            <IoIosGitMerge />
            eum
          </div>
        </a.AuthName>
      </div>
      <a.FormTag
        onSubmit={handleSubmit(onSubmitHandler)}
        aria-label="이메일 비밀번호 입력하기"
      >
        <a.SignInContainer>
          <a.ItemContainer>
            <a.InputBox
              type="email"
              placeholder="이메일"
              {...register('email')}
              style={{ borderColor: errors?.email?.message ? '#FF0000' : '' }}
              onChange={onChangeEmailHandler}
              value={email}
              onKeyDown={handleOnKeyPress}
            />
            {email ? (
              <a.CloseIcon
                onClick={handleInputValueClickBT}
                aria-label="닫기"
              />
            ) : undefined}
            {errors.email && errors.email.type === 'required' && (
              <a.ErrorMSG>이메일을 입력해주세요.</a.ErrorMSG>
            )}
            {errors.email && errors.email.type === 'email' && (
              <a.ErrorMSG>이메일 형식을 입력해주세요.</a.ErrorMSG>
            )}
          </a.ItemContainer>
          <a.ItemContainer>
            <a.InputBox
              type={isViewPW ? 'text' : 'password'}
              placeholder="비밀번호"
              {...register('pw')}
              style={{ borderColor: errors?.pw?.message ? '#FF0000' : '' }}
              onChange={onChangePwHandler}
              value={pw}
              onKeyDown={handleOnKeyPress}
            />
            {pw ? (
              <a.ViewIcon
                onClick={handleClickViewPW}
                style={{ color: isViewPW ? '#000' : '#ddd' }}
                aria-label="비밀번호 입력하기"
              />
            ) : undefined}
            {errors.pw && errors.pw.type === 'required' && (
              <a.ErrorMSG>비밀번호를 입력해주세요.</a.ErrorMSG>
            )}
            {errors.pw && errors.pw.type === 'matches' && (
              <a.ErrorMSG>
                비밀번호는 영문+숫자+특수문자 포함하여 8자 이상이여야 합니다.
              </a.ErrorMSG>
            )}
            <a.ErrorMSG>{err}</a.ErrorMSG>
          </a.ItemContainer>
        </a.SignInContainer>
        <a.LoginButton type="submit" aria-label="로그인">
          로그인 하기
        </a.LoginButton>
      </a.FormTag>
      <a.PTag>SNS 로그인</a.PTag>
      <a.SocialContainer>
        <button onClick={onGoogleClick} aria-label="구글 로그인">
          <a.GoogleIcon />
          구글 로그인 하기
        </button>
      </a.SocialContainer>
      <a.MoveSignUpButton
        onClick={() => navigate('/signup')}
        aria-label="회원가입"
      >
        아직 회원이 아니신가요?
      </a.MoveSignUpButton>
      <a.PwLossButtonContainer>
        <a.PwLossButton onClick={onClickToggleModal} aria-label="비밀번호 찾기">
          비밀번호를 잊으셨나요?
        </a.PwLossButton>
      </a.PwLossButtonContainer>
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
    </a.AuthContainer>
  );
};

export default SignIn;
