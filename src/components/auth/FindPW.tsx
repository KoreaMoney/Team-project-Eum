import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ISignUpForm } from '../../types';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/Firebase';

const FindPW = () => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  const onChangeEmailHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(e.target.value);
  };
  const handleInputValueClickBT = () => {
    setEmail('');
  };
  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
  });

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
            style={{ borderColor: errors?.email?.message ? 'red' : '' }}
            onChange={onChangeEmailHandler}
            value={email}
          />
          {email ? <CloseIcon onClick={handleInputValueClickBT} /> : undefined}
        </ItemContainer>
        <SendEmailButton>인증메일 발송</SendEmailButton>
      </FormTag>
      {err && <ErrorMSG>{err}</ErrorMSG>}
      {success && <SuccessMSG>이메일이 발송되었습니다.</SuccessMSG>}
    </>
  );
};

export default FindPW;

const SuccessMSG = styled.p`
  color: blue;
  font-size: 0.8rem;
`;
const ErrorMSG = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const FormTag = styled.form`
  width: 100%;
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: black;
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

const SendEmailButton = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1.1rem;
  background-color: #e4e4e4;
  margin: 1rem 0 0 0;
  cursor: pointer;
  &:hover {
    background-color: #e1e1e1;
  }
`;
