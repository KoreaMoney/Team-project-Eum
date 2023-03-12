import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getSellerPosts, getUserComments, getUsers } from '../api';
import { userCommentsAtom, userPostsAtom, userProfileAtom } from '../atom';

import styled from 'styled-components';
import Nav from '../components/userProfile/Nav';
import ProfileBadge from '../components/userProfile/ProfileBadge';
import UserComments from '../components/userProfile/UserComments';
import UserOnSale from '../components/userProfile/UserOnSale';
import UserPageProfile from '../components/userProfile/UserPageProfile';
import Loader from '../components/etc/Loader';

const UserProfile = () => {
  const { id } = useParams();
  const setUserProfile = useSetRecoilState(userProfileAtom);
  const setUserPosts = useSetRecoilState(userPostsAtom);
  const setUserComments = useSetRecoilState(userCommentsAtom);

  /**유저 정보 불러오기 */
  const { data: User, isLoading } = useQuery(['user', id], () => getUsers(id), {
    onSuccess: (data) => setUserProfile(data),
  });

  /**유저의 포스트 리스트 불러오기 */
  useQuery(['post', id], () => getSellerPosts(id), {
    onSuccess: (data) => setUserPosts(data),
  });

  /**유저의 후기 불러오기 */
  useQuery(['comments', id], () => getUserComments(id), {
    onSuccess: (data) => setUserComments(data),
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Container>
        <Wrapper>
          <UserPageProfile />
          <Nav />
          <ProfileBadge />
          <UserOnSale />
          <UserComments />
        </Wrapper>
      </Container>
    </>
  );
};

export default UserProfile;

const Container = styled.div`
  width: 100vw;
`;
const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  margin-top: 97px;
`;
