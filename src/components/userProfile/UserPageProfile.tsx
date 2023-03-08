import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { userProfileAtom, viewKakaoModalAtom } from '../../atom';

const UserPageProfile = () => {
  const userProfile = useRecoilValue(userProfileAtom);
  const setIsModalActive = useSetRecoilState(viewKakaoModalAtom);

  return (
    <Container>
      <ProfileIMG profileIMG={userProfile?.profileImg} />
      <ProfileContainer>
        <NickName>{userProfile?.nickName}</NickName>
        <SubmitButton onClick={() => setIsModalActive(true)}>
          카카오톡으로 문의하기
        </SubmitButton>
      </ProfileContainer>
    </Container>
  );
};

export default UserPageProfile;

const Container = styled.div`
  padding: 42px 77px;
  display: flex;
  align-items: center;
  gap: 58px;
`;

const ProfileIMG = styled.div<{ profileIMG: string | undefined | null }>`
  width: 155px;
  height: 155px;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const ProfileContainer = styled.div`
  width: 391px;
  height: 136px;
`;

const NickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  line-height: ${(props) => props.theme.lineHeight.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  margin-bottom: 24px;
`;
const SubmitButton = styled.button`
  width: 383px;
  height: 64px;
  border-radius: 10px;
  border: none;
  font-size: ${(props) => props.theme.fontSize.ad24};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.orange02Main};
  color: ${(props) => props.theme.colors.white};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
    border: 1px solid ${(props) => props.theme.colors.orange02Main};
  }
  &:active {
    font-weight: ${(props) => props.theme.fontWeight.medium};
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;
