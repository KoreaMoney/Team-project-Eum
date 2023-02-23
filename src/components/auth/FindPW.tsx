import React, { useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ISignUpForm } from '../../types';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/Firebase';

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
    <>
      <ModalTitle>비밀번호 찾기</ModalTitle>
      <FormTag onSubmit={handleSubmit(onSubmitHandler)}>
        <ItemContainer>
          <InputBox
            type="email"
            placeholder="이메일"
            {...register('email')}
            style={{ borderColor: errors?.email?.message ? '#FF0000' : '' }}
            onChange={onChangeEmailHandler}
            value={email}
          />
          {email ? <CloseIcon onClick={handleInputValueClickBT} /> : undefined}
        </ItemContainer>
        {err && <ErrorMSG>{err}</ErrorMSG>}
        {success && <SuccessMSG>이메일이 발송되었습니다.</SuccessMSG>}
        <SendEmailButton>인증메일 발송</SendEmailButton>
      </FormTag>
    </>
  );
};
export default FindPW;
const ModalTitle = styled.h2`
  margin-bottom: 3rem;
  text-align: center;
  color: ${(props) => props.theme.colors.black};
`;
const FormTag = styled.form`
  width: 100%;
`;
const ItemContainer = styled.div`
  position: relative;
  width: 25rem;
  height: 2.8rem;
`;
const InputBox = styled.input`
  width: 100%;
  height: 2.4rem;
  padding: 0 3rem 0 1rem;
  font-size: 1rem;
  background-color: ${(props) => props.theme.colors.white};
  border: 2px solid ${(props) => props.theme.colors.brandColor};
  border-radius: 8px;
  &::placeholder {
    color: ${(props) => props.theme.colors.gray10};
  }
  &:focus {
    outline: none;
  }
`;
const CloseIcon = styled(AiFillCloseCircle)`
  position: absolute;
  bottom: 13px;
  right: 20px;
  font-size: 26px;
  color: ${(props) => props.theme.colors.gray10};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.gray30};
  }
`;
const SuccessMSG = styled.p`
  color: blue;
  font-size: 0.8rem;
`;
const ErrorMSG = styled.p`
  color: ${(props) => props.theme.colors.red};
  font-size: 0.8rem;
`;
const SendEmailButton = styled.button`
  width: 100%;
  height: 3rem;
  margin: 1rem 0 0 0;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.gray40};
  background-color: ${(props) => props.theme.colors.brandColor};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.gray10};
  }
`;
