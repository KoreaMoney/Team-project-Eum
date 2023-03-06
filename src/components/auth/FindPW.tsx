import React, { useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ISignUpForm } from '../../types';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/Firebase';
import { theme } from '../../styles/theme';

/**순서
 * 1. email작성
 * 2. email작성 관련 유효성 검사
 * 3. 등록된 email로 변경 메세지 보내기
 */
const FindPW = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');

  //email작성하기
  const onChangeEmailHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(e.target.value);
  };

  //input에서 email 확인하기
  const handleInputValueClickBT = () => {
    setEmail('');
  };

  //유효성 검사하기 위한 시작하기
  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });

  //유효성 검사하기
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
  });

  //변경될 비밀번호 이메일로 전송하기
  const onSubmitHandler = async () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (errorMessage.includes('user-not-found')) {
          setErr('가입된 회원이 아닙니다.');
          return;
        }
      });
  };

  return (
    <FindPwContainer>
      <FindPwText>비밀번호 찾기</FindPwText>
      <FindPwForm
        onSubmit={handleSubmit(onSubmitHandler)}
        aria-label="비밀번호 찾기"
      >
        <FindPWInputWrapper>
          <FindPWInputText>이메일 아이디</FindPWInputText>
          <FindPwIconBox>
            <FindPWInput
              type="email"
              placeholder=""
              {...register('email')}
              style={{ borderColor: errors?.email?.message ? '#ff334b' : '' }}
              onChange={onChangeEmailHandler}
              value={email}
            />
            {email ? (
              <CloseIcon onClick={handleInputValueClickBT} aria-label="확인" />
            ) : undefined}
          </FindPwIconBox>
        </FindPWInputWrapper>
        {err && <ErrorMSG>❗{err}</ErrorMSG>}
        {success && <SuccessMSG>✅ 이메일이 발송되었습니다.</SuccessMSG>}
        <FindPWBtn aria-label="인증메일 전송">인증메일 발송 하기</FindPWBtn>
      </FindPwForm>
    </FindPwContainer>
  );
};
export default FindPW;

const FindPwContainer = styled.div`
  width: 384px;
  height: 272px;
`;

const FindPwText = styled.div`
  color: ${theme.colors.black};
  font-size: ${theme.fontSize.title32};
  font-weight: ${theme.fontWeight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FindPwForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 96px;
  width: 100%;
  height: 144px;
`;

const FindPWInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid ${theme.colors.orange02Main};
  width: 100%;
  height: 64px;
  padding: 13px;
`;

const FindPWInputText = styled.span`
  font-size: 12px;
  width: 120px;
  height: 18px;
  margin-bottom: 3px;
  color: ${theme.colors.gray30}; ;
`;

const FindPwIconBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const FindPWInput = styled.input`
  width: 100%;
  height: 21px;
  font-size: ${theme.fontSize.title14};
  background-color: transparent;
  border: none;
  outline: none;
`;

const CloseIcon = styled(AiFillCloseCircle)`
  color: ${theme.colors.gray20};
  &:hover {
    cursor: pointer;
    color: ${theme.colors.orange02Main};
  }
`;

const FindPWBtn = styled.button`
  width: 100%;
  height: 64px;
  margin-top: 16px;
  color: ${theme.colors.white};
  font-size: ${theme.fontSize.title16};
  background-color: ${theme.colors.orange02Main};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${theme.colors.white};
    color: ${theme.colors.orange02Main};
    border: 1px solid ${theme.colors.orange02Main};
  }
  &:active {
    color: ${theme.colors.white};
    background-color: ${theme.colors.orange02Main};
    border: none;
  }
`;

const SuccessMSG = styled.p`
  color: ${theme.colors.green};
  font-size: 13px;
  width: 100%;
  height: 16px;
  padding: 5px;
`;

const ErrorMSG = styled.p`
  color: ${theme.colors.red};
  font-size: 13px;
  width: 100%;
  height: 16px;
  padding: 5px;
`;
