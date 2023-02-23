import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AiFillCloseCircle, AiFillEye, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { IoIosGitMerge } from 'react-icons/io';
import { ISignUpForm, userType } from '../types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import * as yup from 'yup';
import axios from 'axios';
import styled from 'styled-components';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [isViewPW, setIsViewPW] = useState(false);
  const [isViewCheckPW, setIsViewCheckPW] = useState(false);
  const [nickName, setNickName] = useState('');
  const [checkNick, setCheckNick] = useState(0);
  const [err, setErr] = useState('');
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
  const { mutate } = useMutation((newUser: userType) =>
    axios.post(`${process.env.REACT_APP_JSON}/users`, newUser)
  );
  // 여기서 바로 쓸 수 있게끔 에러처리 만들어주기
  // 닉네임 중복 확인을 위해 데이터를 가져옴
  const { data } = useQuery(['users'], async () => {
    const url = `${process.env.REACT_APP_JSON}/users`;
    const response = await axios.get(url);
    console.log( 'url: ' ,url);
    
    return response.data;
  });
console.log( 'data: ' ,data);

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
  const onChangeCheckPwHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCheckPw(e.target.value);
  };
  const onChangeNickNameHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNickName(e.target.value);
  };

  /**닉네임 중복확인 버튼 누르면 실행되는 함수
   * 안에서 가공 하게끔 만드는 / select옵션, fetch해올 때 데이터를 바깥에다 쓸 때 data.data.map 하면 지저분하니까 깔끔하게 data.map 할 수 있게 가공해줄 수 있음. 그게 select옵션
   * 리코일 selector과 비슷함. 가공을 떠올리면 됨, 서버에서 받아온 데이터값을 우리가 원하는 값으로 가공 -> 우리 컴포넌트 안에서 쓸 수 있게 만들어주는 것. / usequery select 검색 하고 사용할 것.
   */

  /**닉네임 중복 로직 : 중복확인 버튼 안누르면 0, 눌렀는데 중복이면 1, 눌렀는데 중복 없으면 2 (2가 되야 통과임)
   *
   */
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
      }
    }
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
          .then(() => {
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
            point: 10000000,
            contactTime: '',
            like: [],
            profileImg: null,
            isDoneCount: 0,
          });

          await updateProfile(auth.currentUser, {
            displayName: nickName,
          })
            .then(() => {
              navigate('/signin');
              customInfoAlert(`${nickName}님 회원가입을 축하합니다`);
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
      <Container>
        <div>
          <MainText>
            세상 모든 재능을 이어주다
            <span>
              사소하고 별거없는 재능도 가치를 만드세요. <br />
              <br />
              이제 이음과 함께 시작해보세요.!
            </span>
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
            </ItemContainer>
            <ItemContainer>
              <InputBox
                type={isViewCheckPW ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                {...register('checkPw')}
                style={{
                  borderColor: errors?.checkPw?.message ? '#FF0000' : '',
                }}
                onChange={onChangeCheckPwHandler}
                value={checkPw}
              />
              {checkPw ? (
                <ViewIcon
                  onClick={handleClickCheckPW}
                  style={{ color: isViewCheckPW ? '#000' : '#ddd' }}
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
              style={{ borderColor: errors?.pw?.message ? '#FF0000' : '' }}
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
  height: 12rem;
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

const MoveSignInButton = styled.button`
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

const CheckBT = styled.button`
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

const PassMSG = styled.p`
  color: green;
  margin-top: 0.3rem;
  font-size: ${(props) => props.theme.fontSize.label12};
`;

const JoinButton = styled.button`
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
