import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  customConfirm,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import { auth } from '../firebase/Firebase';
import SignIn from './SignIn';
import parse from 'html-react-parser';
import basicIMG from '../styles/basicIMG.webp';
import * as a from '../styles/styledComponent/transaction';
import { userType } from '../types';
import { getOnSalePost, getUsers, patchOnSalePost, patchUsers } from '../api';
import { IoExitOutline } from 'react-icons/io5';
import { CustomModal } from '../components/modal/CustomModal';
import { useRecoilState } from 'recoil';
import { isCancelAtom, isDoneAtom } from '../atom';

/**순서
 * 1. query-key만들기
 * 2. 판매자, 구매자 데이터 가져오기
 * 3. 포인트 취소, 완료, 환불 기능추가하기
 */
const Transaction = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [current, setCurrent] = useState(false);
  const queryClient = useQueryClient();
  const onClickBtn = () => {
    navigate(-1);
  };
  const [isCancelled, setIsCancelled] = useState(false);
  const [isDone, setIsDone] = useRecoilState(isDoneAtom);
  const [isCancel, setIsCancel] = useRecoilState(isCancelAtom);
  const [isCancelConfirmed, setIsCancelConfirmed] = useState(0);
  auth.onAuthStateChanged((user: any) => setCurrent(user?.uid));
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
  const { data, isLoading } = useQuery(
    ['salePost', id],
    () => getOnSalePost(id),
    {
      onSuccess: () => queryClient.invalidateQueries(['salePost0', id]),
    }
  );
  console.log('data: ', data);

  const [buyerData, setBuyerData] = useState<userType | null>(null);
  const [sellerData, setSellerData] = useState<userType | null>(null);

  useEffect(() => {
    if (data && data[0]) {
      const fetchBuyer = async () => {
        const buyer = await getUsers(data[0].buyerUid);
        setBuyerData(buyer);
      };
      const fetchSeller = async () => {
        const seller = await getUsers(data[0].sellerUid);
        setSellerData(seller);
      };

      fetchBuyer();
      fetchSeller();
    }
  }, [data]);

  // 거래완료 시 판매자의 포인트를 더해주는 mutation 함수
  const { mutate: updateUser } = useMutation(
    (newUser: { point: number; isDoneCount: number }) =>
      patchUsers(data?.[0]?.sellerUid, newUser),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['sellerData', sellerData?.id]),
    }
  );

  // 완료 시 isDone을 true로 만들기 위한 함수
  const { mutate: clearRequest } = useMutation(
    (newSalePosts: { isDone: boolean; doneTime: number }) =>
      patchOnSalePost(id, newSalePosts),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['salePost1', id]);
        setIsDone(true);
      },
    }
  );
  useEffect(() => {
    if (data?.[0].isDone) {
      setIsDone(true);
    }
  }, [data?.[0].isDone, setIsDone]);
  useEffect(() => {
    if (data?.[0].isCancel) {
      setIsCancel(true);
    }
  }, [data?.[0].isCancel, setIsCancel]);

  // 취소 시 cancel data를 업데이트 해주기 위한 함수
  const { mutate: sellerCancel } = useMutation(
    (newSalePost: { isSellerCancel: boolean }) =>
      patchOnSalePost(id, newSalePost),
    {
      onSuccess: (newSalePost) => {
        queryClient.invalidateQueries(['salePost2', id]);
        if (newSalePost.isSellerCancel && newSalePost.isBuyerCancel) {
          giveBackPoint({
            point: Number(buyerData?.point) + Number(data?.[0]?.price),
          });
        }
      },
    }
  );

  const { mutate: buyerCancel } = useMutation(
    (newSalePost: { isBuyerCancel: boolean }) =>
      patchOnSalePost(id, newSalePost),
    {
      onSuccess: (newSalePost) => {
        queryClient.invalidateQueries(['salePost3', id]);
        if (newSalePost.isSellerCancel && newSalePost.isBuyerCancel) {
          giveBackPoint({
            point: Number(buyerData?.point) + Number(data?.[0]?.price),
          });
        }
      },
    }
  );

  const { mutate: cancelTrue } = useMutation(
    (newSalePosts: { cancelTime: number; isCancel: boolean }) =>
      patchOnSalePost(id, newSalePosts),
    {
      onSuccess: () => {
        setIsCancel(true);
        queryClient.invalidateQueries(['salePost4', id]);
      },
    }
  );

  // 취소 시 구매자의 point를 복구시켜주는 함수
  const { mutate: giveBackPoint } = useMutation(
    (newUser: { point: number }) => patchUsers(buyerData?.id, newUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['buyerData', buyerData?.id]);
        cancelTrue({
          cancelTime: Date.now(),
          isCancel: true,
        });
      },
    }
  );
  /** 포인트 순서
   * 1. 구매자가 완료버튼을 누르면 판매자에게 price만큼 포인트를 더한다
   * 2. 등급을 위한 user의 isDoneCount 데이터도 +1 추가
   * 3. isDone도 true로 변경되어 판매,구매가 완료
   */

  const onClickClearRequest = async () => {
    await updateUser({
      point: Number(sellerData?.point) + Number(data?.[0]?.price),
      isDoneCount: (sellerData?.isDoneCount ?? 0) + 1,
    });
    await clearRequest({
      isDone: true,
      doneTime: Date.now(),
    });
  };

  // 판매자,구매자가 취소버튼을 누르면 실행되는 함수입니다.
  const onClickCancel = () => {
    queryClient.invalidateQueries(['salePost', id]);

    customConfirm(
      '취소 하시겠습니까?',
      '구매자, 판매자 전부 취소버튼을 눌러야 취소됩니다.',
      '확인',
      async () => {
        if (saveUser.uid === data?.[0]?.sellerUid) {
          await sellerCancel({
            isSellerCancel: true,
          });
        } else if (saveUser.uid === data?.[0]?.buyerUid) {
          await buyerCancel({
            isBuyerCancel: true,
          });
        }
      }
    );
  };

  //로딩 구간
  if (isLoading) {
    return <div>Now Loading...</div>;
  }
  if (!data || data.length === 0) {
    return <div>추가적인 데이터가 없습니다</div>;
  }
  if (!saveUser) {
    return <SignIn />;
  }

  return (
    <a.TransactionContainer>
      {isDone && (
        <a.TransactionText>
          <button onClick={onClickBtn}>
            <IoExitOutline size={50} />
          </button>
          <h1>거래가 완료되었습니다.</h1>
        </a.TransactionText>
      )}
      {isCancel && (
        <a.TransactionText>
          <h1>거래가 취소되었습니다.</h1>
        </a.TransactionText>
      )}
      <a.TransactionWrapper>
        <a.SellerImage img={data?.[0]?.imgURL} aria-label="포스트 이미지" />
        <a.SellerContainer>
          <h2>{data?.[0]?.title}</h2>
          <p>{data?.[0]?.price} 원</p>
          <span>판매자</span>
          <a.ProfileContainer>
            <a.ProfileWrapper>
              <a.ProfileLeft>
                <a.ProfileIMG
                  profileIMG={
                    sellerData?.profileImg ? sellerData?.profileImg : basicIMG
                  }
                  aria-label="프로필 이미지"
                />
              </a.ProfileLeft>
              <a.ProfileRight>
                <p>{sellerData?.nickName}</p>
              </a.ProfileRight>
            </a.ProfileWrapper>
            <a.ProfileBottom>
              <a.ProfileBottomContainer>
                <a.ProfileBottomWrapper>
                  <p>연락가능시간</p>
                  <span>
                    {sellerData?.contactTime
                      ? sellerData?.contactTime
                      : '00:00 ~ 24:00'}
                  </span>
                </a.ProfileBottomWrapper>
              </a.ProfileBottomContainer>
              <a.ProfileBottomInfo>
                <div>
                  <button aria-label="판매상품">판매상품 10개</button>
                  <button aria-label="받은 후기">받은 후기</button>
                </div>
              </a.ProfileBottomInfo>
            </a.ProfileBottom>
          </a.ProfileContainer>
          {saveUser.uid === data?.[0]?.buyerUid ||
          saveUser.uid === data?.[0]?.sellerUid ? (
            <a.SellerLikeWrapper>
              {saveUser.uid === data?.[0]?.buyerUid && !isCancel ? (
                <button onClick={onClickClearRequest} aria-label="완료">
                  완료
                </button>
              ) : saveUser.uid === data?.[0]?.buyerUid && isCancel ? (
                <button aria-label="취소 완료">
                  취소 완료
                </button>
              ) : null}

              {isDone ? (
                <button aria-label="거래 종료">거래 종료</button>
              ) : (
                <button
                  onClick={() => {
                    onClickCancel();
                  }}
                  aria-label="거래취소"
                >
                  거래 취소
                </button>
              )}
            </a.SellerLikeWrapper>
          ) : null}
        </a.SellerContainer>
      </a.TransactionWrapper>
      <a.TransactionPost>
        <div>{parse(data?.[0]?.content)}</div>
      </a.TransactionPost>
    </a.TransactionContainer>
  );
};

export default Transaction;
