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
  if (!post || post.length === 0) {
    return <div>No data found</div>;
  }

  /**바로 신청하기 버튼 클릭
   * user 데이터의 point가 price만큼 빠지고
   * mutate로 데이터를 저장합니다
   */
  const onClickApplyBuy = () => {
    customConfirm(
      '이음 재능을 연결하시겠습니까?',
      '연결을 누르시면 포인트가 차감됩니다.',
      '연결',
      () => {
        if (!saveUser) {
          navigate('/signin', { state: { from: location.pathname } });
          return;
        }

        /**null인 경우 0으로 초기화 */
        const point = Number(user?.point) || 0;
        const price = Number(post?.[0]?.price) || 0;

        /**구매자의 포인트에서 price만큼 뺀걸 구매자의 user에 업데이트 */
        if (point >= price) {
          updateUser({ point: point - price });
          const uuid = uuidv4();
          onSalePosts({
            id: uuid,
            postsId: id,
            buyerUid: saveUser.uid,
            buyerNickName: user?.nickName,
            sellerUid: post?.[0]?.sellerUid,
            sellerNickName: post?.[0]?.nickName,
            title: post?.[0]?.title,
            content: post?.[0]?.content,
            imgURL: post?.[0]?.imgURL,
            price: post?.[0]?.price,
            category: post?.[0]?.category,
            createdAt: Date.now(),
            isDone: false,
            isSellerCancel: false,
            isBuyerCancel: false,
            isCancel: false,
            cancelTime: 0,
            doneTime: 0,
            reviewDone: false,
          });
          setTimeout(() => {
            navigate(`/detail/${categoryName}/${id}/${user.id}/${uuid}`);
          }, 500);
        } else {
          customWarningAlert('포인트가 부족합니다.');
        }
      }
    );
  };

  /**화면 중간 네브바*/
  const onClickNavExSeller = () => {
    setIsDescriptionActive(true);
    setIsReviewActive(false);
    scrollToTop();
  };
  const onClickNavReview = () => {
    setIsDescriptionActive(false);
    setIsReviewActive(true);
    goReview();
  };

  /**현재 URL 복사 */
  const linkCopy = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        customSuccessAlert('재능 공유가 되었습니다!');
      })
      .catch((error) => {
        console.error(`Could not copy URL to clipboard: ${error}`);
      });
  };

  /**설명이나 판매자 누르면 맨위로 */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**후기 누르면 후기로 */
  const goReview = () => {
    window.scrollTo({
      top: 1306,
      behavior: 'smooth',
    });
  };

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
