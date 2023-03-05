import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ISignUpForm, userType } from '../types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import * as yup from 'yup';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import * as a from '../styles/styledComponent/auth';
import { getAuthUsers, postUsers } from '../api';
import basicIMG from '../styles/basicIMG.webp'
import Header from '../components/layout/Header';

const SignUp = () => {
  const navigate = useNavigate();

  const [isViewPW, setIsViewPW] = useState(false);
  const [isViewCheckPW, setIsViewCheckPW] = useState(false);
  const [checkNick, setCheckNick] = useState(0);
  const [err, setErr] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [registering, setRegistering] = useState(false);

  // 유효성 검사를 위한 코드들
  // 영문+숫자+특수기호 포함 8~20자 비밀번호 정규식
  const passwordRule =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  const schema = yup.object().shape({
    email: yup
      .string()
      .required('이메일을 입력해주세요.')
      .email('❗올바른 이메일 형식이 아닙니다.'),
    pw: yup
      .string()
      .required('❗비밀번호를 입력해주세요.')
      .matches(passwordRule, '❗영문+숫자+특수문자형식 8글자 이상입니다.'),
    checkPw: yup
      .string()
      .required('비밀번호를 입력해주세요.')
      .oneOf([yup.ref('pw')], '❗비밀번호가 일치하지 않습니다.'),
    nickName: yup.string().required('❗닉네임을 입력해주세요.'),
  });

  // react hook form 라이브러리 사용
  const {
    register,
    watch,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // 회원가입 성공 시 users에 data 추가
  const { mutate } = useMutation((newUser: userType) => postUsers(newUser));
  // 여기서 바로 쓸 수 있게끔 에러처리 만들어주기
  // 닉네임 중복 확인을 위해 데이터를 가져옴
  const { data } = useQuery(['users'], getAuthUsers);
  const nickNameList = data?.map((user: userType) => user.nickName);
  // 비밀번호 눈알 아이콘 클릭 시 type 변경 할 수 있는 함수
  // 비밀번호 , 비밀번호체크랑 따로 구현했습니다.
  const handleClickViewPW = () => {
    setIsViewPW(!isViewPW);
  };
  const handleClickCheckPW = () => {
    setIsViewCheckPW(!isViewCheckPW);
  };

  // x 버튼 누르면 email input 초기화
  const handleInputValueClickBT = () => {
    reset({
      email: '',
    });
  };

  /**닉네임 중복확인 버튼 누르면 실행되는 함수
   * 안에서 가공 하게끔 만든다
   * select옵션, fetch해올 때 데이터를 바깥에다 쓸 때 data.data.map 하면 지저분하니까 깔끔하게 data.map 할 수 있게 가공해줄 수 있음. 그게 select옵션중복된 닉네임입니다
   * 리코일 selector과 비슷함. 가공을 떠올리면 됨, 서버에서 받아온 데이터값을 우리가 원하는 값으로 가공 -> 우리 컴포넌트 안에서 쓸 수 있게 만들어주는 것.
   * useQuery select 검색 하고 사용할 것.
   */

  /**닉네임 중복 로직 : 중복확인 버튼 안누르면 0, 눌렀는데 중복이면 1, 눌렀는데 중복 없으면 2 (2가 되야 통과임)
   *
   */
  const handleCheckOverlapNickName = () => {
    const nickName = getValues('nickName');
    if (!nickName) {
      setErrMsg('닉네임을 입력해주세요.');
    }
    const result = nickNameList.includes(nickName);
    if (result) {
      setCheckNick(1);
      customWarningAlert('중복된 닉네임입니다.');
    } else {
      if (nickName) {
        setCheckNick(2);
        setErrMsg('✅중복되는 닉네임이 없습니다.');
      }
    }
  };

  // 등록하기 버튼 누르면 실행되는 함수
  const onSubmitHandler: SubmitHandler<ISignUpForm> = async ({ email, pw }) => {
    if (errors.checkPw || errors.email || errors.pw) {
      return;
    } else {
      if (checkNick === 0) {
        setErrMsg('❗닉네임 중복 확인을 해주세요.');
        return;
      } else if (checkNick === 1) {
        return;
      } else {
        setRegistering(true);
        await createUserWithEmailAndPassword(auth, email, pw)
          .then(() => {
            customInfoAlert(
              `${getValues(
                'nickName'
              )}님 반갑습니다!\n\n재능을 이어주는 이음\n회원가입이 완료되었습니다.`
            );
          })
          .catch((error) => {
            const errorMessage = error.message;
            if (errorMessage.includes('auth/email-already-in-use')) {
              setErr('이미 가입된 회원입니다.');
              customWarningAlert('이미 가입된 회원입니다.');
              setRegistering(false);
              return;
            }
          });

        if (auth.currentUser) {
          await mutate({
            id: auth.currentUser?.uid,
            nickName: getValues('nickName'),
            point: 10000000,
            contactTime: '',
            like: [],
            profileImg: `${basicIMG}`,
            isDoneCount: 0,
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

          await updateProfile(auth.currentUser, {
            displayName: getValues('nickName'),
          })
            .then(() => {
              const authObserver = auth.onAuthStateChanged((user) => {
                if (user) {
                  sessionStorage.setItem('user', JSON.stringify(user));
                } else {
                  sessionStorage.removeItem('user');
                }
              });
              navigate('/');
              return () => authObserver();
            })
            .catch(() => {
              customWarningAlert('다시 가입을 시도해주세요');
            });
        } else {
          return <div>닉네임을 등록해주세요.</div>;
        }
      }
    }
  };

  return (
    <>
      <Header />
      <a.LoginContainer>
        <a.LoginText>회원가입</a.LoginText>
        <a.SignUpForm
          onSubmit={handleSubmit(onSubmitHandler)}
          aria-label="이메일 비밀번호 입력하기"
        >
          <a.SignUpInputWrapper
            style={{ borderColor: errors?.email?.message ? '#ff334b' : '' }}
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
          </a.SignUpInputWrapper>
          <a.ErrMsg>{errors.email?.message}</a.ErrMsg>
          <a.SignUpPwWrapper
            style={{ borderColor: errors?.pw?.message ? '#ff334b' : '' }}
          >
            <a.LoginInputText>비밀번호</a.LoginInputText>
            <a.LoginMiniWrapper>
              <a.LoginInput
                type={isViewPW ? 'text' : 'password'}
                placeholder=""
                {...register('pw')}
              />
              <a.LoginPwIcon
                size={22}
                onClick={handleClickViewPW}
                style={{ color: isViewPW ? '#FF6C2C' : '#C2C1C1' }}
                aria-label="비밀번호 입력하기"
              />
            </a.LoginMiniWrapper>
          </a.SignUpPwWrapper>
          <a.ErrMsg>{errors.pw?.message}</a.ErrMsg>
          <a.SignUpPwCheckWrapper
            style={{
              borderColor: errors?.checkPw?.message ? '#ff334b' : '',
            }}
          >
            <a.LoginInputText>비밀번호 확인</a.LoginInputText>
            <a.LoginMiniWrapper>
              <a.LoginInput
                type={isViewCheckPW ? 'text' : 'password'}
                placeholder=""
                {...register('checkPw')}
              />

              <a.LoginPwIcon
                size={22}
                onClick={handleClickCheckPW}
                style={{ color: isViewCheckPW ? '#FF6C2C' : '#C2C1C1' }}
                aria-label="비밀번호 확인하기"
              />
            </a.LoginMiniWrapper>
          </a.SignUpPwCheckWrapper>
          <a.ErrMsg>{errors.checkPw?.message}</a.ErrMsg>
          <a.SignUpNickname>
            <a.SignUpNicknameWrapper
              style={{
                borderColor: errors?.nickName?.message ? '#ff334b' : '',
              }}
            >
              <a.LoginInputText>닉네임</a.LoginInputText>
              <a.SignUpInputNick
                type="text"
                placeholder=""
                {...register('nickName')}
              />
            </a.SignUpNicknameWrapper>
            <a.SignUpCheckBtn
              type="button"
              onClick={handleCheckOverlapNickName}
              aria-label="중복확인"
            >
              중복확인
            </a.SignUpCheckBtn>
          </a.SignUpNickname>
          <a.ErrMsg>
            {errors.nickName?.message}
            {checkNick === 0 && errMsg}
            {checkNick === 2 && <a.PassMSG>{errMsg}</a.PassMSG>}
          </a.ErrMsg>
          <a.SignUpBtn disabled={registering} aria-label="회원가입">
            회원가입
          </a.SignUpBtn>
        </a.SignUpForm>
      </a.LoginContainer>
      {console.log('registering', registering)}
    </>
  );
};
export default SignUp;
