import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useNavigate, useLocation } from 'react-router';
import { IoIosGitMerge } from 'react-icons/io';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth } from '../firebase/Firebase';
import { userType, ILoginForm } from '../types';
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
import { customWarningAlert } from '../components/modal/CustomAlert';
import basicIMG from '../styles/basicIMG.webp';

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
      .required('이메일을 입력해주세요.')
      .email('올바른 이메일 형식이 아닙니다.'),
    password: yup
      .string()
      .required('비밀번호를 입력해주세요.')
      .matches(
        passwordRule,
        '비밀번호는 영문+숫자+특수문자형식 8글자 이상 입니다.'
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
            setErr('가입된 회원이 아닙니다.');
            customWarningAlert('가입된 회원이 아닙니다.');
            return;
          } else if (errorMessage.includes('wrong-password')) {
            setErr('비밀번호가 일치하지 않습니다.');
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
            commentsCount: 0,
            kakaoId: '',
            birthDate:'',
            time: 0,
            fast: 0,
            manner: 0,
            service: 0,
            cheap: 0,
            donation: 0,
            repBadge:'',
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
            />
            <a.CloseIcon onClick={handleInputValueClickBT} aria-label="닫기" />
            <a.ErrorMSG>{errors.email?.message}</a.ErrorMSG>
          </a.ItemContainer>

          <a.ItemContainer>
            <a.InputBox
              type={isViewPW ? 'text' : 'password'}
              placeholder="비밀번호"
              {...register('password')}
              style={{
                borderColor: errors?.password?.message ? '#FF0000' : '',
              }}
            />

            <a.ViewIcon
              onClick={handleClickViewPW}
              style={{ color: isViewPW ? '#000' : '#ddd' }}
              aria-label="비밀번호 입력하기"
            />
            <a.ErrorMSG>{errors.password?.message}</a.ErrorMSG>
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
