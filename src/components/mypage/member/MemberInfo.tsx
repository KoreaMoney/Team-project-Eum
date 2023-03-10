import { useRecoilValue } from 'recoil';
import {
  addBirthDateAtom,
  addKakaoAtom,
  addNickNameAtom,
  choiceBadgeAtom,
  editNickNameAtom,
} from '../../../atom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUsers } from '../../../api';
import loadable from '@loadable/component';
import styled from 'styled-components';
import {
  customSuccessAlert,
  customWarningAlert,
} from '../../modal/CustomAlert';

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

  const validateBirthDate = (value: string) => {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(value);
  };

  /**프로필 저장 */
  const onSubmitMember = () => {
    const editNickName = editNickNameValue?.trim();
    if (!editNickName) {
      customWarningAlert('닉네임을 작성해 주세요.');
      return;
    }
    if (nickNameCheck === true) {
      customWarningAlert('닉네임 중복검사를 해주세요.');
      return;
    }
    if (editBirthValue) {
      if (!validateBirthDate(editBirthValue)) {
        customWarningAlert('생년월일은 YYYY-MM-DD 형식으로 입력해주세요.');
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
  };
  return (
    <>
      <ProfileImg />
      <UserName />
      <Badge />

      <SubmitButton onClick={onSubmitMember}>저장하기</SubmitButton>
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
  margin-bottom: 234px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
`;
