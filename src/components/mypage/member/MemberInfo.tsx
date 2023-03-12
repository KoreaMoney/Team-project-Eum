import { useRecoilValue } from 'recoil';
import {
  addBirthDateAtom,
  addKakaoAtom,
  addNickNameAtom,
  choiceBadgeAtom,
  editNickNameAtom,
} from '../../../atom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserNickName, patchUsers } from '../../../api';
import loadable from '@loadable/component';
import styled from 'styled-components';
import {
  customSuccessAlert,
  customWarningAlert,
} from '../../modal/CustomAlert';
import { useState } from 'react';

const ProfileImg = loadable(() => import('./ProfileImg'));
const UserName = loadable(() => import('./UserName'));
const Badge = loadable(() => import('./Badge'));

const MemberInfo = () => {
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const queryClient = useQueryClient();

  const editKakaoValue = useRecoilValue(addKakaoAtom);
  const editBirthValue = useRecoilValue(addBirthDateAtom);
  const repBadgeChoice = useRecoilValue(choiceBadgeAtom);
  const editNickNameValue = useRecoilValue(addNickNameAtom);
  const nickNameCheck = useRecoilValue(editNickNameAtom);
  const [reCheck, setReCheck] = useState(false);

  const { mutate: updateUser } = useMutation(
    (newUser: {
      nickName: string;
      kakaoId: string;
      birthDate: string;
      repBadge: string;
    }) => patchUsers(saveUser?.uid, newUser),
    {
      onSuccess: () => queryClient.invalidateQueries(['user', saveUser?.uid]),
    }
  );

  useQuery(
    ['recheckusers', editNickNameValue],
    () => getUserNickName(editNickNameValue),
    {
      enabled: reCheck,
      onSuccess: (item) => {
        const nickNameDataLength = item?.nickName.length > 0;
        const checkMyNickName = item?.id === saveUser?.uid;
        const editNickName = editNickNameValue?.trim();
        if (!editNickName) {
          customWarningAlert('닉네임을 작성해 주세요.');
          setReCheck(!reCheck);
          return;
        } else if (nickNameCheck === 0) {
          customWarningAlert('닉네임 중복검사를 해주세요.');
          setReCheck(!reCheck);
          return;
        } else if (nickNameCheck === 1) {
          customWarningAlert('이미 사용중인 닉네임 입니다.');
          setReCheck(!reCheck);
          return;
        } else if (nickNameDataLength && !checkMyNickName) {
          customWarningAlert('누가 방금 닉네임을 등록하였습니다.');
          setReCheck(!reCheck);
          return;
        }
        if (editBirthValue) {
          if (!validateBirthDate(editBirthValue)) {
            customWarningAlert('생년월일은 YYYY-MM-DD 형식으로 입력해주세요.');
            setReCheck(!reCheck);
            return;
          } else {
            updateUser({
              nickName: editNickNameValue,
              kakaoId: editKakaoValue,
              birthDate: editBirthValue,
              repBadge: repBadgeChoice,
            });
            customSuccessAlert('프로필 수정이 완료되었습니다.');
          }
        } else {
          updateUser({
            nickName: editNickNameValue,
            kakaoId: editKakaoValue,
            birthDate: editBirthValue,
            repBadge: repBadgeChoice,
          });
          customSuccessAlert('프로필 수정이 완료되었습니다.');
        }
        setReCheck(!reCheck);
      },
      select: (data) => {
        return data[0];
      },
    }
  );
  const validateBirthDate = (value: string) => {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(value);
  };

  /**프로필 저장 */
  const onSubmitMember = () => {
    setReCheck(!reCheck);
  };
  return (
    <>
      <ProfileImg />
      <UserName />
      <Badge />
      <SubmitButton onClick={onSubmitMember} aria-label="저장하기">
        저장하기
      </SubmitButton>
    </>
  );
};

export default MemberInfo;

const SubmitButton = styled.button`
  width: 588px;
  height: 64px;
  background-color: ${(props) => props.theme.colors.orange02Main};
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.fontSize.ad24};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;
