import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { getUsers, getUserNickName } from '../../../api';
import {
  addBirthDateAtom,
  addKakaoAtom,
  addNickNameAtom,
  editNickNameAtom,
} from '../../../atom';
import * as a from '../../../styles/styledComponent/myPage';
import Loader from '../../etc/Loader';

const UserName = () => {
  const [editKakaoValue, setEditKakaoValue] = useRecoilState(addKakaoAtom);
  const [editBirthValue, setEditBirthValue] = useRecoilState(addBirthDateAtom);
  const [editNickNameValue, setEditNickNameValue] =
    useRecoilState(addNickNameAtom);
  const [nickNameCheck, setNickNameCheck] = useRecoilState(editNickNameAtom);

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  /* 1. 로그인한 유저 정보를 받아옵니다.
   * 2. 닉네임을 중복검사합니다.
   * 3. 유저의 닉네임에 접근해서 patch합니다.
   */
  const { data } = useQuery(['users', saveUser.uid], () =>
    getUsers(saveUser.uid)
  );

  const { data: nickNameData, isLoading } = useQuery(
    ['users', editNickNameValue],
    () => getUserNickName(editNickNameValue),
    {
      select: (data) => {
        return data[0];
      },
    }
  );

  const nickNameCheckClick = () => {
    const editNickNameData = nickNameData?.nickName === editNickNameValue;
    const nickNameDataLength = nickNameData?.nickName.length === 0;
    const checkMyNickName = nickNameData?.id === saveUser?.uid;
    if (nickNameDataLength || (checkMyNickName && editNickNameData)) {
      setNickNameCheck(2);
    } else if (nickNameData?.nickName.length > 0) {
      setNickNameCheck(1);
    } else if (!nickNameData) {
      setNickNameCheck(2);
    }
  };

  useEffect(() => {
    setEditKakaoValue(data?.kakaoId);
    setEditBirthValue(data?.birthDate);
    setEditNickNameValue(data?.nickName);
  }, [data]);

  // 생년월일을 입력합니다.
  const onChangeBirthDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 4글자 입력 시 yyyy- 추가
    if (/^\d{4}$/.test(value)) {
      setEditBirthValue(value + '-');
    }
    // 7글자 입력 시 yyyy-mm- 추가
    else if (/^\d{4}-\d{2}$/.test(value)) {
      setEditBirthValue(value + '-');
    }
    // 10글자 이상 입력 시 뒤의 문자열 제거
    else if (value.length > 10) {
      setEditBirthValue(value.slice(0, 10));
    }
    // 기타 문자열은 그대로 적용
    else {
      setEditBirthValue(value);
    }
  };

  return (
    <div>
      <a.UserInfoBox>
        <a.UserInfoTitle>이메일 아이디</a.UserInfoTitle>
        <a.UserInfoContent>{saveUser.email}</a.UserInfoContent>
      </a.UserInfoBox>
      <a.KakaoIdBox>
        <a.KakaoTitle>닉네임 {'( 최대 8자 )'}</a.KakaoTitle>
        <a.UserNickName
          value={editNickNameValue}
          type="text"
          onChange={(e) => setEditNickNameValue(e.target.value)}
          aria-label="닉네임 입력하기"
          maxLength={8}
        />
        <a.UserNickNameBtn onClick={nickNameCheckClick}>
          중복검사
        </a.UserNickNameBtn>
      </a.KakaoIdBox>
      {isLoading ? (
        <Loader />
      ) : nickNameCheck === 0 ? (
        <a.NickNameInfoCheck>•ㅤ중복검사를 해주세요.</a.NickNameInfoCheck>
      ) : nickNameCheck === 2 ? (
        <a.NickNameInfoPass>•ㅤ사용 가능한 닉네임입니다.</a.NickNameInfoPass>
      ) : nickNameCheck === 1 ? (
        <a.NickNameInfo>•ㅤ이미 사용중인 닉네임입니다.</a.NickNameInfo>
      ) : null}
      <a.KakaoIdBox>
        <a.KakaoTitle>생일정보</a.KakaoTitle>
        <a.KakaoId
          value={editBirthValue}
          type="text"
          onChange={onChangeBirthDate}
          aria-label="생일 정보 입력하기"
        />
      </a.KakaoIdBox>
      <a.BirthInfo>•ㅤ생일을 정확하게 입력해주세요.</a.BirthInfo>
      <a.KakaoInfo>•ㅤ만 14세 이상만 회원가입이 가능합니다.</a.KakaoInfo>
    </div>
  );
};

export default UserName;
