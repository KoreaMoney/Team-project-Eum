import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { getPostsId, getSellerPosts, getUserComments, getUsers } from '../api';
import { userCommentsAtom, userPostsAtom, userProfileAtom, viewKakaoModalAtom } from '../atom';
import KakaoModal from '../components/modal/KakaoModal';
import Nav from '../components/userProfile/Nav';
import ProfileBadge from '../components/userProfile/ProfileBadge';
import UserComments from '../components/userProfile/UserComments';
import UserOnSale from '../components/userProfile/UserOnSale';
import UserPageProfile from '../components/userProfile/UserPageProfile';
import { Link } from 'react-scroll';
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
  const { data: post } = useQuery(['post', id], () => getSellerPosts(id), {
    onSuccess: (data) => setUserPosts(data),
  });

  /**유저의 후기 불러오기 */
   const { data: comments } = useQuery(
     ['comments', id],
     () => getUserComments(id),
     {
       onSuccess: (data) => setUserComments(data),
     }
   );

  if (isLoading) {
    return <Loader />
  }


  return (
    <>
      <Container>
        <UserPageProfile />
        <KakaoModal />
        <Nav />
        <ProfileBadge />
        <UserOnSale />
        <UserComments />
      </Container>
    </>
  );
};

export default UserProfile;

const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
  margin-top: 97px;
`;
