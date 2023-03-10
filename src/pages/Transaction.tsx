import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../firebase/Firebase';
import { getOnSalePost } from '../api';
import { IoExitOutline } from 'react-icons/io5';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isCancelAtom, isDoneAtom, onSalePostAtom, viewKakaoModalAtom } from '../atom';
import Loader from '../components/etc/Loader';
import * as a from '../styles/styledComponent/detail';
import PostImg from '../components/detail/PostImg';
import PostInfo from '../components/transaction/PostInfo/PostInfo';
import Content from '../components/transaction/content/Content';

/**순서
 * 1. query-key만들기
 * 2. 판매자, 구매자 데이터 가져오기
 * 3. 포인트 취소, 완료, 환불 기능추가하기
 */
const Transaction = () => {
  const navigate = useNavigate();
  auth.onAuthStateChanged((user: any) => setCurrent(user?.uid));
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const queryClient = useQueryClient();

  const { uuid } = useParams();
  const [current, setCurrent] = useState(false);
  const isDone = useRecoilValue(isDoneAtom);
  const isCancel = useRecoilValue(isCancelAtom);
  const setOnSalePost = useSetRecoilState(onSalePostAtom);
  const setIsModalActive = useSetRecoilState(viewKakaoModalAtom);
  const onClickBtn = () => {
    navigate(-1);
  };

  /**onSalePost 데이터 가지고오기 */
  const { data, isLoading } = useQuery(
    ['salePost', uuid],
    () => getOnSalePost(uuid),
    {
      onSuccess: (data) => {
        console.log('data: ', data);

        queryClient.invalidateQueries(['salePost0', uuid]);
        setOnSalePost(data);
      },
      refetchOnMount: 'always',
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: 'always',
    }
  );
  const onClickKakaoButton = () => {
    setIsModalActive(true);
  };
  //로딩 구간
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <div>추가적인 데이터가 없습니다</div>;
  }

  //회원가입 된 유저가 아니라면 로그인 화면으로 이동합니다.
  if (!saveUser) {
    navigate('/signin');
  }

  return (
    <a.DetailContainer>
      <a.DetailWrapper>
        {isDone && (
          <a.TransactionText>
            <button onClick={onClickBtn}>
              <IoExitOutline size={50} />
            </button>
            <h1>이음이 연결되었습니다.</h1>
          </a.TransactionText>
        )}
        {isCancel && (
          <a.TransactionText>
            <button onClick={onClickBtn}>
              <IoExitOutline size={50} />
            </button>
            <h1>이음이 취소되었습니다.</h1>
          </a.TransactionText>
        )}
        <a.PostContainer>
          <PostImg />
          <PostInfo />
          <>
            <a.KakaoButton onClick={onClickKakaoButton}>
              카카오톡으로 문의하기
            </a.KakaoButton>
            <KakaoModal />
          </>
        </a.PostContainer>
        <Content />
      </a.DetailWrapper>
    </a.DetailContainer>
  );
};

export default Transaction;
