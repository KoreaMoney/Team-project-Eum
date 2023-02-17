import { useState } from 'react';
import styled from 'styled-components';
import { AiFillCloseCircle, AiFillEye, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ISignUpForm, userType } from '../types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import axios, { AxiosResponse } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

const SignUp = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const [isViewPW, setIsViewPW] = useState(false);
  const [isViewCheckPW, setIsViewCheckPW] = useState(false);
  const [pw, setPw] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [checkNick, setCheckNick] = useState(0);
  const [errMsg, setErrMsg] = useState('');

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
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
  });
  // 회원가입 성공 시 users에 data 추가
  const { mutate, isError, isLoading } = useMutation((newUser: userType) =>
    axios.post('http://localhost:4000/users', newUser)
  );
  // 여기서 바로 쓸 수 있게끔 에러처리 만들어주기
  // 닉네임 중복 확인을 위해 데이터를 가져옴
  const { data } = useQuery(['users'], async () => {
    const response = await axios.get('http://localhost:4000/users');
    return response.data;
  });
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
    setEmail('');
  };
  // input state 관리해주는 함수들
  const onChangeEmailHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(e.target.value);
  };
  const onChangePwHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPw(e.target.value);
  };
  const onChangecheckPwHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCheckPw(e.target.value);
  };
  const onChangeNickNameHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNickName(e.target.value);
  };
  // 닉네임 중복확인 버튼 누르면 실행되는 함수
  const handleCheckOverlapNickName = () => {
    if (!nickName) {
      setErrMsg('닉네임을 입력해주세요.');
    }
    const result = nickNameList.includes(nickName);
    if (result) {
      setCheckNick(1);
    } else {
      if (nickName) {
        setCheckNick(2);
        setErrMsg('✅중복되는 닉네임이 없습니다.');
        // 닉네임 중복 로직 : 중복확인 버튼 안누르면 0, 눌렀는데 중복이면 1, 눌렀는데 중복 없으면 2 (2가 되야 통과임)
      }
    }
    // 안에서 가공 하게끔 만드는 / select옵션, fetch해올 때 데이터를 바깥에다 쓸 때 data.data.map 하면 지저분하니까 깔끔하게 data.map 할 수 있게 가공해줄 수 있음. 그게 select옵션
    // 리코일 selector과 비슷함. 가공을 떠올리면 됨, 서버에서 받아온 데이터값을 우리가 원하는 값으로 가공 -> 우리 컴포넌트 안에서 쓸 수 있게 만들어주는 것. / usequery select 검색 하고 사용할 것.
  };
  // 등록하기 버튼 누르면 실행되는 함수
  const onSubmitHandler: SubmitHandler<ISignUpForm> = async () => {
    if (errors.checkPw || errors.email || errors.pw) {
      return;
    } else {
      if (checkNick === 0) {
        setErrMsg('닉네임 중복을 확인해주세요.');
        return;
      } else if (checkNick === 1) {
        return;
      } else {
        await createUserWithEmailAndPassword(auth, email, pw)
          .then( () => {
            setEmail('');
            setPw('');
            setCheckPw('');
            setErr('');
            setNickName('');
            
          })
          .catch((error) => {
            const errorMessage = error.message;
            if (errorMessage.includes('auth/email-already-in-use')) {
              setErr('이미 가입된 회원입니다.');
              return;
            }
          });
        if (auth.currentUser) {
          await mutate({
            id: auth.currentUser?.uid,
            nickName,
            profileImg: auth.currentUser?.photoURL,
            point: '0',
            contactTime: '',
            like: [],
            isDoneCount: 0,
          });
          await updateProfile(auth.currentUser, {
            displayName: nickName,
          }).then(() => navigate('/'));
        } else {
          return <div>닉네임을 등록해주세요.</div>;
        }
      }
    }
  };
  console.log( 'auth.currentUser?.uid: ' ,auth.currentUser?.uid);
  
  return (
    <>
      <Container>
        <InfoBox>
          <InfoText>당신 곁의 개인 비서</InfoText>
          <InfoText>프로젝트 이름</InfoText>
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
            </ItemContainer>
            <ItemContainer>
              <InputBox
                type={isViewCheckPW ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                {...register('checkPw')}
                style={{ borderColor: errors?.checkPw?.message ? 'red' : '' }}
                onChange={onChangecheckPwHandler}
                value={checkPw}
              />
              {checkPw ? (
                <ViewIcon
                  onClick={handleClickCheckPW}
                  style={{ color: isViewCheckPW ? 'black' : '#ddd' }}
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
          <ItemContainer>
            <InputBox
              type="text"
              placeholder="닉네임"
              style={{ borderColor: errors?.pw?.message ? 'red' : '' }}
              onChange={onChangeNickNameHandler}
              value={nickName}
            />
            <CheckBT type="button" onClick={handleCheckOverlapNickName}>
              중복확인
            </CheckBT>
            {checkNick === 1 && <ErrorMSG>중복된 닉네임입니다.</ErrorMSG>}
            {checkNick === 0 && <ErrorMSG>{errMsg}</ErrorMSG>}
            {checkNick === 2 && <PassMSG>{errMsg}</PassMSG>}
          </ItemContainer>
          <JoinButton>등록하기</JoinButton>
        </FormTag>
        <MoveSignInButton onClick={() => navigate('/signin')}>
          이미 회원이신가요?
        </MoveSignInButton>
      </Container>
    </>
  );
};
export default SignUp;

const CheckBT = styled.button`
  width: 20%;
  height: 30px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  background-color: #e4e4e4;
  position: absolute;
  bottom: 25px;
  right: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e1e1e1;
  }
`;
const PassMSG = styled.p`
  color: green;
  font-size: 0.8rem;
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
