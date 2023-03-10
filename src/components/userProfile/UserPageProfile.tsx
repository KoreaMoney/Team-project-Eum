import { useRecoilValue } from 'recoil';
import { userProfileAtom } from '../../atom';
import styled from 'styled-components';

const UserPageProfile = () => {
  const userProfile = useRecoilValue(userProfileAtom);

  return (
    <Container>
      <ProfileIMG profileIMG={userProfile?.profileImg} />
      <ProfileContainer>
        <NickName>{userProfile?.nickName}</NickName>
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
  display: flex;
  align-items: center;
  width: 391px;
  height: 136px;
`;

const NickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  line-height: ${(props) => props.theme.lineHeight.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;
