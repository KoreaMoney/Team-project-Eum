import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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

  auth.onAuthStateChanged((user: any) => setCurrent(user?.uid));
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
  const { data, isLoading } = useQuery(
    ['salePost', id],
    () => getOnSalePost(id)
  );


// 구매자의 user정보 가져오기
  const { data: buyerData } = useQuery(
    ['user', saveUser?.uid],
    () => getUsers(saveUser?.uid),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
    }
  );

  // 판매자의 user정보 가져오기. data를 사용하기에 onsuccess 안에 넣어줬습니다.
  // const { data: sellerData } = useQuery(
  //   ['user', data?.[0]?.sellerUid],
  //   () => getUsers(data?.[0]?.sellerUid),
  //   {
  //     staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
  //   }
  // );

  const [sellerData, setSellerData] = useState<userType | null>(null);

  useEffect(() => {
    if (data && data[0]) {
      const fetchSeller = async () => {
        const seller = await getUsers(data[0].sellerUid);
        setSellerData(seller);
      };
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
      onSuccess: () => queryClient.invalidateQueries(['salePost', id]),
    }
  );

  // 취소 시 cancel data를 업데이트 해주기 위한 함수
  const { mutate: cancel } = useMutation(
    (newSalePosts: { isSellerCancel: boolean; isBuyerCancel: boolean }) =>
      patchOnSalePost(id, newSalePosts),
    {
      onSuccess: () => queryClient.invalidateQueries(['salePost', id]),
    }
  );

  const { mutate: cancelTrue } = useMutation(
    (newSalePosts: { cancelTime: number }) => patchOnSalePost(id, newSalePosts),
    {
      onSuccess: () => queryClient.invalidateQueries(['salePost', id]),
    }
  );

  // 취소 시 구매자의 point를 복구시켜주는 함수
  const { mutate: giveBackPoint } = useMutation(
    (newUser: { point: string }) => patchUsers(data?.[0]?.buyerUid, newUser),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['buyerData', data?.[0]?.buyerUid]),
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
    customConfirm(
      '취소 하시겠습니까?',
      '구매자, 판매자 전부 취소버튼을 눌러야 취소됩니다.',
      '확인',
      async () => {
        if (saveUser.uid === data?.[0]?.sellerUid) {
          await cancel({
            ...data[0],
            isSellerCancel: true,
            isBuyerCancel: data?.[0]?.isBuyerCancel,
          });
        } else {
          await cancel({
            ...data[0],
            isSellerCancel: data?.[0]?.isSellerCancel,
            isBuyerCancel: true,
          });
        }
      }
    );
  };

  // 둘다 취소하면 isCancel이 true로 변경되고 cancelTime이 추가됩니다.

  // 둘다 취소하면 포인트를 구매자에게 돌려줍니다.
  useEffect(() => {
    const dataEffect = async () => {
      if (
        data?.[0]?.isSellerCancel === true &&
        data?.[0]?.isBuyerCancel === true
      ) {
        await cancelTrue({
          ...data[0],
          cancelTime: Date.now(),
        });
      }
      if (data?.[0]?.isCancel) {
        await giveBackPoint({
          point: String(Number(buyerData?.point) + Number(data?.[0]?.price)),
        });
      }
    };
    dataEffect();
  }, [data?.[0]?.isSellerCancel, data?.[0]?.isBuyerCancel]);

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
      {data?.[0]?.isDone && (
        <a.TransactionText>
          <button onClick={onClickBtn}>
            <IoExitOutline size={50} />
          </button>
          <h1>거래가 완료되었습니다.</h1>
        </a.TransactionText>
      )}
      {data?.[0].isSellerCancel && data?.[0].isBuyerCancel && (
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
              {saveUser.uid === data?.[0]?.buyerUid ? (
                <button onClick={onClickClearRequest} aria-label="완료">
                  완료
                </button>
              ) : null}
              <button onClick={onClickCancel} aria-label="거래취소">
                거래 취소
              </button>
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
