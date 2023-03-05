import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getUsers, patchUsers } from '../../../api';
import { addBirthDateAtom, addKakaoAtom } from '../../../atom';
import * as a from '../../../styles/styledComponent/myPage';
import { kakaoType } from '../../../types';
import { customWarningAlert } from '../../modal/CustomAlert';

const UserName = () => {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState('');
  const [editKakaoValue, setEditKakaoValue] = useRecoilState(addKakaoAtom);
  const [editBirthValue, setEditBirthValue] = useRecoilState(addBirthDateAtom);
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  /* 1. 로그인한 유저 정보를 받아옵니다.
   * 2. 유저의 닉네임에 접근해서 patch합니다.
   * 3. 유저의 닉네임을 수정합니다.
   */
  const { isLoading: getLoading, data } = useQuery(
    ['users', saveUser.uid],
    () => getUsers(saveUser.uid)
  );

  useEffect(() => {
    setEditKakaoValue(data?.kakaoId);
    setEditBirthValue(data?.birthDate);
  }, [data])
  
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
        <a.UserInfoTitle>닉네임</a.UserInfoTitle>
        <a.UserInfoContent>{data?.nickName}</a.UserInfoContent>
      </a.UserInfoBox>
      <a.KakaoIdBox>
        <a.KakaoTitle>카카오톡 아이디</a.KakaoTitle>
        <a.KakaoId
          value={editKakaoValue}
          type="text"
          onChange={(e) => setEditKakaoValue(e.target.value)}
        />
      </a.KakaoIdBox>
      <a.KakaoInfo>
        •ㅤ카카오톡 아이디는 상품 판매에 활용되므로 정확하게 입력해주세요.
      </a.KakaoInfo>
      <a.KakaoIdBox>
        <a.KakaoTitle>생일정보</a.KakaoTitle>
        <a.KakaoId
          value={editBirthValue}
          type="text"
          onChange={onChangeBirthDate}
        />
      </a.KakaoIdBox>
      <a.BirthInfo>•ㅤ생일을 정확하게 입력해주세요.</a.BirthInfo>
      <a.KakaoInfo>•ㅤ만 14세 이상만 회원가입이 가능합니다.</a.KakaoInfo>
    </div>
  );
};

export default UserName;
