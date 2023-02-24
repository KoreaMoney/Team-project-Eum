import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customConfirm } from '../components/modal/CustomAlert';
import { auth } from '../firebase/Firebase';
import SignIn from './SignIn';
import parse from 'html-react-parser';
import basicIMG from '../styles/basicIMG.png';
import * as a from '../styles/styledComponent/transaction';

/**순서
 * 1. query-key만들기
 * 2. 판매자, 구매자 데이터 가져오기
 * 3. 포인트 취소, 완료, 환불 기능추가하기
 */
const Transaction = () => {
  const { id } = useParams();

  const [current, setCurrent] = useState(false);
  const queryClient = useQueryClient();

  auth.onAuthStateChanged((user: any) => setCurrent(user?.uid));
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
  const { data, isLoading } = useQuery(['salePost', id], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_JSON}/onSalePosts?id=${id}`
    );
    return response.data;
  });

  // 판매자의 user 데이터를 가지고 옵니다.
  const { data: sellerData } = useQuery(
    ['sellerData', data?.[0]?.sellerUid],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/users/${data?.[0]?.sellerUid}`
      );
      return response.data;
    }
  );

  // 구매자의 user 데이터를 가지고 옵니다.
  const { data: buyerData } = useQuery(
    ['buyerData', data?.[0]?.buyerUid],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/users/${data?.[0]?.buyerUid}`
      );
      return response.data;
    }
  );

  // user의 포인트를 수정해주는 mutation 함수
  const { mutate: updateUser } = useMutation(
    (newUser: { point: number; isDoneCount: number }) =>
      axios.patch(
        `${process.env.REACT_APP_JSON}/users/${data?.[0]?.sellerUid}`,

        newUser
      ),
    {
      onSuccess: () => queryClient.invalidateQueries(['sellerData']),
    }
  );

  // 완료 시 isDone을 true로 만들기 위한 함수
  const { mutate: clearRequest } = useMutation(
    (newSalePost: { isDone: boolean }) =>
      axios.patch(
        `${process.env.REACT_APP_JSON}/onSalePosts/${id}`,
        newSalePost
      ),
    {
      onSuccess: () => queryClient.invalidateQueries(['salePost']),
    }
  );

  // 취소 시 cancel data를 업데이트 해주기 위한 함수
  const { mutate: cancel } = useMutation(
    (newSalePost: { isSellerCancel: boolean; isBuyerCancel: boolean }) =>
      axios.patch(
        `${process.env.REACT_APP_JSON}/onSalePosts/${id}`,
        newSalePost
      ),
    {
      onSuccess: () => queryClient.invalidateQueries(['salePost']),
    }
  );

  // 취소 시 구매자의 point를 복구시켜주는 함수
  const { mutate: giveBackPoint } = useMutation(
    (newUser: { point: string }) =>
      axios.patch(
        `${process.env.REACT_APP_JSON}/users/${data?.[0]?.buyerUid}`,

        newUser
      ),
    {
      onSuccess: () => queryClient.invalidateQueries(['buyerData']),
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
      isDoneCount: sellerData.isDoneCount + 1,
    });
    await clearRequest({
      isDone: true,
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
            isSellerCancel: true,
            isBuyerCancel: data?.[0]?.isBuyerCancel,
          });
        } else {
          await cancel({
            isSellerCancel: data?.[0]?.isSellerCancel,
            isBuyerCancel: true,
          });
        }
      }
    );
  };

  // 둘다 취소하면 포인트를 구매자에게 돌려줍니다.
  useEffect(() => {
    if (data?.[0]?.isSellerCancel && data?.[0]?.isBuyerCancel) {
      giveBackPoint({
        point: String(Number(buyerData?.point) + Number(data?.[0]?.price)),
      });
    }
  }, [data]);

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
          <h1>거래가 완료되었습니다.</h1>
        </a.TransactionText>
      )}
      {data?.[0]?.isSellerCancel && data?.[0]?.isBuyerCancel && (
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
