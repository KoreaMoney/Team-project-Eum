import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  detailPostAtom,
  detailUserAtom,
  isCancelAtom,
  isDoneAtom,
  myOnSalePostsAtom,
} from '../atom';
import * as a from '../styles/styledComponent/detail';
import axios from 'axios';
import loadable from '@loadable/component';
import { getPostsId, getUsers } from '../api';
import Loader from '../components/etc/Loader';
import BuyerModal from '../components/modal/BuyerModal';
import PostImg from '../components/detail/PostImg';
import PostInfo from '../components/detail/PostInfo/PostInfo';
import NavBar from '../components/detail/PostInfo/NavBar';
import DetailContent from '../components/detail/content/DetailContent';
const CommentsList = loadable(
  () => import('../components/comment/CommentsList')
);

/**순서
 * 1. query구성을 진행하여 데이터를 get함
 * 2. 판매자 uid 가져오기
 * 3. 포인트 수정
 * 4. 포인트 수정후 저장
 * 5. 글 찜 기능 추가
 * 6. 글 찜 기능 수정, 삭제
 * 7. 댓글 수정 삭제
 * 8. 구매자 포인트 신청
 * 9. 포인트 환불
 */

const Detail = () => {
  const { id } = useParams();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const queryClient = useQueryClient();

  const setIsCancel = useSetRecoilState(isCancelAtom);
  const setIsDone = useSetRecoilState(isDoneAtom);
  const setPostData = useSetRecoilState(detailPostAtom);
  const setUserData = useSetRecoilState(detailUserAtom);
  const setNewSalePosts = useSetRecoilState(myOnSalePostsAtom);
  // 클릭한 글의 데이터를 가지고 옵니다.
  // 쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
  useEffect(() => {
    setIsCancel(false);
    setIsDone(false);
  }, []);

  /**Detail Post 정보 가져오기 */
  const { data: post, isLoading } = useQuery(
    ['post', id],
    () => getPostsId(id),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
      onSuccess: (data) => setPostData(data),
    }
  );

  /**구매자가 바로구매하기 버튼을 누르면 구매자의 정보를 가져옵니다. */
  const { data: user } = useQuery(
    ['user', saveUser?.uid],
    () => getUsers(saveUser?.uid),
    {
      enabled: Boolean(saveUser), // saveUser?.uid가 존재할 때만 쿼리를 시작
      onSuccess: (data) => setUserData(data),
      refetchOnMount: 'always',
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: 'always',
    }
  );

  useEffect(() => {
    if (post) {
      queryClient.invalidateQueries(['post', id]);
    }
  }, [post, queryClient, id]);

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries(['user', post?.[0].sellerUid]);
    }
  }, [user, queryClient, post?.[0]?.sellerUid]);


  /**판매중인 글, 삭제금지 */
  const { data: myOnSale } = useQuery(
    ['myOnSale'],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/onSalePosts?sellerUid=${
          saveUser.uid
        }&isDone=${false}&isCancel=${false}`
      );
      return response.data;
    },
    {
      onSuccess: (data) => setNewSalePosts(data),
    }
  );
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <a.DetailContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <a.DetailWrapper>
          <a.PostContainer>
            <BuyerModal />
            <PostImg />
            <PostInfo />
          </a.PostContainer>
          <NavBar />
          <DetailContent />
          <CommentsList />
        </a.DetailWrapper>
      )}
    </a.DetailContainer>
  );
};

export default Detail;
