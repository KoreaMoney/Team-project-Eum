import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useNavigate, useLocation } from 'react-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth } from '../firebase/Firebase';
import { userType, ILoginForm } from '../types';
import { CustomModal } from '../components/modal/CustomModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import * as a from '../styles/styledComponent/auth';
import { getAuthUsers, postUsers } from '../api';
import { customWarningAlert } from '../components/modal/CustomAlert';
import basicIMG from '../styles/basicIMG.webp';
import loadable from '@loadable/component';

const FindPW = loadable(() => import('../components/auth/FindPW'));
const Header = loadable(() => import('../components/layout/Header'));

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  //비밀번호 확인
  const handleClickViewPW = () => {
    setIsViewPW(!isViewPW);
  };
  const passwordRule =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  const schema = yup.object().shape({
    email: yup
      .string()
      .required('❗이메일을 입력해주세요.')
      .email('❗올바른 이메일 형식이 아닙니다.'),
    password: yup
      .string()
      .required('❗비밀번호를 입력해주세요.')
      .matches(
        passwordRule,
        '❗비밀번호는 영문+숫자+특수문자형식 8글자 이상 입니다.'
      ),
  });

  //비밀번호 유효성 검사
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // x 버튼 누르면 email input 초기화
  const handleInputValueClickBT = () => {
    reset({
      email: '',
    });
  };

  //이메일 비밀번호 최종 유효성 검사
  const onSubmitHandler: SubmitHandler<ILoginForm> = async ({
    email,
    password,
  }) => {
    if (errors.password || errors.email) {
      return;
    } else {
      setAuthenticating(true);
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate(location.state?.from ? location.state.from : '/');
        })
        .catch((error) => {
          setAuthenticating(false);
          const errorMessage = error.message;
          if (errorMessage.includes('user-not-found')) {
            setErr('❗가입된 회원이 아닙니다.');
            customWarningAlert('가입된 회원이 아닙니다.');
            return;
          } else if (errorMessage.includes('wrong-password')) {
            setErr('❗비밀번호가 일치하지 않습니다.');
            customWarningAlert('비밀번호가 일치하지 않습니다.');
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
            profileImg: `${basicIMG}`,
            like: [],
            isDoneCount: 0,
            study: 0,
            play: 0,
            advice: 0,
            etc: 0,
            commentsCount: 0,
            kakaoId: '',
            birthDate: '',
            time: 0,
            fast: 0,
            manner: 0,
            service: 0,
            cheap: 0,
            donation: 0,
            repBadge: '',
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

  // 비밀번호 찾기 모달
  const [isModalActive, setIsModalActive] = useState(false);
  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  return (
    <>
      <Header />
      <a.LoginContainer>
        <a.LoginText>로그인</a.LoginText>
        <a.LoginForm
          onSubmit={handleSubmit(onSubmitHandler)}
          aria-label="이메일 비밀번호 입력하기"
        >
          <a.LoginInputWrapper
            style={{
              borderColor: errors?.email?.message ? '#ff334b' : '',
            }}
          >
            <a.LoginInputText>이메일 아이디</a.LoginInputText>
            <a.LoginMiniWrapper>
              <a.LoginInput
                type="email"
                placeholder=""
                {...register('email')}
              />
              <a.LoginCloseIcon
                size={20}
                onClick={handleInputValueClickBT}
                aria-label="닫기"
              />
            </a.LoginMiniWrapper>
          </a.LoginInputWrapper>
          <a.ErrMsg>{errors.email?.message}</a.ErrMsg>
          <a.LoginInputWrapper
            style={{
              borderColor: errors?.password?.message ? '#ff334b' : '',
            }}
          >
            <a.LoginInputText>비밀번호</a.LoginInputText>
            <a.LoginMiniWrapper>
              <a.LoginInput
                type={isViewPW ? 'text' : 'password'}
                placeholder=""
                {...register('password')}
              />

              <a.LoginPwIcon
                size={22}
                onClick={handleClickViewPW}
                style={{ color: isViewPW ? '#FF6C2C' : '#C2C1C1' }}
                aria-label="비밀번호 입력하기"
              />
            </a.LoginMiniWrapper>
          </a.LoginInputWrapper>
          <a.ErrMsg>{errors.password?.message}</a.ErrMsg>
          <a.SubmitLogin type="submit" aria-label="로그인">
            로그인
          </a.SubmitLogin>
        </a.LoginForm>
        <a.LoginAnd>또는</a.LoginAnd>
        <a.GoogleWrapper>
          <a.GoogleBtn onClick={onGoogleClick} aria-label="구글 로그인">
            <a.GoogleIconWrapper>
              <a.GoogleIcon size={30} />
              <p>Google 계정으로 계속하기</p>
            </a.GoogleIconWrapper>
          </a.GoogleBtn>
        </a.GoogleWrapper>
        <a.LoginOther>
          <button onClick={() => navigate('/signup')} aria-label="회원가입">
            회원가입
          </button>

          <button onClick={onClickToggleModal} aria-label="비밀번호 찾기">
            비밀번호 찾기
          </button>
        </a.LoginOther>
        {isModalActive ? (
          <CustomModal
            modal={isModalActive}
            setModal={setIsModalActive}
            width="544"
            height="432"
            overflow="hidden"
            element={
              <div>
                <FindPW />
              </div>
            }
          />
        ) : (
          ''
        )}
      </a.LoginContainer>
    </>
  );
};

export default SignIn;
