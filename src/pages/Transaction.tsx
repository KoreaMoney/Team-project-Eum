import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../firebase/Firebase';
import { userType } from '../types';
import { getOnSalePost, getUsers, patchOnSalePost, patchUsers } from '../api';
import { IoExitOutline } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { isCancelAtom, isDoneAtom } from '../atom';

import parse from 'html-react-parser';
import SellerInfo from '../components/detail/SellerInfo';
import BuyerInfo from '../components/detail/BuyerInfo';
import Loader from '../components/etc/Loader';
import KakaoModal from '../components/modal/KakaoModal';
import * as a from '../styles/styledComponent/detail';
import {
  customConfirm,
  customInfoAlert,
  customSuccessAlert,
} from '../components/modal/CustomAlert';

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
  const onClickBtn = () => {
    navigate(-1);
  };

  const { uuid } = useParams();
  const [current, setCurrent] = useState(false);
  const [isDone, setIsDone] = useRecoilState(isDoneAtom);
  const [isCancel, setIsCancel] = useRecoilState(isCancelAtom);

  //쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
  const { data, isLoading } = useQuery(
    ['salePost', uuid],
    () => getOnSalePost(uuid),
    {
      onSuccess: () => queryClient.invalidateQueries(['salePost0', uuid]),
      refetchOnMount: 'always',
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: 'always',
    }
  );

  const [buyerisCancel, setBuyerIsCancel] = useState(data?.[0]?.isBuyerCnacle);
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
      patchOnSalePost(uuid, newSalePosts),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['salePost1', uuid]);
        setIsDone(true);
        navigate(`/review/${data[0].id}`);
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
      patchOnSalePost(uuid, newSalePost),
    {
      onSuccess: (newSalePost) => {
        queryClient.invalidateQueries(['salePost2', uuid]);
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
      patchOnSalePost(uuid, newSalePost),
    {
      onSuccess: (newSalePost) => {
        setBuyerIsCancel(true);
        queryClient.invalidateQueries(['salePost3', uuid]);
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
      patchOnSalePost(uuid, newSalePosts),
    {
      onSuccess: () => {
        setIsCancel(true);
        queryClient.invalidateQueries(['salePost4', uuid]);
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
  const onClickClearRequest = () => {
    customSuccessAlert(
      '이음 재능연결이 완료되었습니다!\n\n후기 작성을 해주세요.'
    );
    let categoryCount;
    if (data[0].category === 'study') {
      categoryCount = { study: (sellerData?.study ?? 0) + 1 };
    } else if (data[0].category === 'play') {
      categoryCount = { play: (sellerData?.play ?? 0) + 1 };
    } else if (data[0].category === 'advice') {
      categoryCount = { advice: (sellerData?.advice ?? 0) + 1 };
    } else {
      categoryCount = { etc: (sellerData?.etc ?? 0) + 1 };
    }
    updateUser({
      point: Number(sellerData?.point) + Number(data?.[0]?.price),
      isDoneCount: (sellerData?.isDoneCount ?? 0) + 1,
      ...categoryCount,
    });
    clearRequest({
      isDone: true,
      doneTime: Date.now(),
    });
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

  // 판매자,구매자가 취소버튼을 누르면 실행되는 함수입니다.
  const onClickCancel = () => {
    queryClient.invalidateQueries(['salePost', uuid]);

    customConfirm(
      '취소 하시겠습니까?',
      '구매자, 판매자 전부 취소버튼을 눌러야 취소됩니다.',
      '확인',
      () => {
        if (saveUser.uid === data?.[0]?.sellerUid) {
          sellerCancel({
            isSellerCancel: true,
          });
        } else if (saveUser.uid === data?.[0]?.buyerUid) {
          buyerCancel({
            isBuyerCancel: true,
          });
        }
      }
    );
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
          <a.PostImage
            img={data[0].imgURL}
            aria-label="post이미지"
            onClick={() => {
              window.open(data[0].imgURL);
            }}
          />
          <a.PostInfoWrapper>
            <a.InfoTopContainer>
              <a.InfoTopLeftContainer>
                <p>
                  {data?.[0].category === 'all'
                    ? '전체'
                    : data?.[0].category === 'study'
                    ? '공부'
                    : data?.[0].category === 'play'
                    ? '놀이'
                    : data?.[0].category === 'advice'
                    ? '상담'
                    : data?.[0].category === 'etc'
                    ? '기타'
                    : '전체'}
                </p>
              </a.InfoTopLeftContainer>
              <a.InfoTopRightContainer>
                <a.IconRightContainer>
                  <a.ShareIcon onClick={linkCopy} />
                </a.IconRightContainer>
              </a.InfoTopRightContainer>
            </a.InfoTopContainer>
            <a.TextContainer>
              <a.TitleText>{data?.[0].title}</a.TitleText>
            </a.TextContainer>
            <a.PostNickName>{data?.[0].sellerNickName}</a.PostNickName>
            <a.PostPrice>
              {data[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P
            </a.PostPrice>

            {saveUser.uid === data?.[0]?.buyerUid ||
            saveUser.uid === data?.[0]?.sellerUid ? (
              <>
                {buyerisCancel || data?.[0].isBuyerCancel ? (
                  <>
                    {saveUser.uid === data?.[0]?.buyerUid ? (
                      <>
                        <a.ButtonsContainer>
                          <a.ClearButton
                            onClick={() =>
                              customInfoAlert(
                                '구매자, 판매자 전부 취소버튼을 \n\n눌러야 취소됩니다.'
                              )
                            }
                            aria-label="취소를 기다리는중"
                          >
                            판매자의 동의를 기다리고있습니다.
                          </a.ClearButton>
                        </a.ButtonsContainer>
                      </>
                    ) : (
                      <>
                        {isDone ? (
                          <a.CancelButton aria-label="거래종료">
                            거래종료
                          </a.CancelButton>
                        ) : (
                          <a.CancelButton
                            onClick={() => {
                              onClickCancel();
                            }}
                            aria-label="거래취소"
                          >
                            거래취소
                          </a.CancelButton>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <a.ButtonsContainer>
                      {saveUser.uid === data?.[0].buyerUid && !isCancel ? (
                        <a.ClearButton
                          onClick={onClickClearRequest}
                          aria-label="완료"
                        >
                          거래완료
                        </a.ClearButton>
                      ) : saveUser.uid === data?.[0]?.buyerUid && isCancel ? (
                        <a.ClearButton aria-label="취소 완료">
                          취소 완료
                        </a.ClearButton>
                      ) : null}

                      {isDone ? (
                        <a.CancelButton aria-label="거래종료">
                          거래종료
                        </a.CancelButton>
                      ) : (
                        <a.CancelButton
                          onClick={() => {
                            onClickCancel();
                          }}
                          aria-label="거래취소"
                        >
                          거래취소
                        </a.CancelButton>
                      )}
                    </a.ButtonsContainer>
                  </>
                )}
              </>
            ) : null}
          </a.PostInfoWrapper>
        </a.PostContainer>

        <a.PostRow>
          <a.PostContentWrapper>
            <a.SellerInfoTitle>
              <p>재능 설명</p>
            </a.SellerInfoTitle>
            <a.SellerInfoContent>
              <p>{parse(data[0].content)}</p>
            </a.SellerInfoContent>
          </a.PostContentWrapper>
          <a.PostContentWrapper>
            {saveUser.uid === data[0].sellerUid ? (
              <>
                <a.SellerInfoTitle>
                  <p>구매자</p>
                </a.SellerInfoTitle>
                <BuyerInfo />
              </>
            ) : (
              <>
                <a.SellerInfoTitle>
                  <p>판매자</p>
                </a.SellerInfoTitle>
                <SellerInfo />
                <KakaoModal />
              </>
            )}
          </a.PostContentWrapper>
        </a.PostRow>
      </a.DetailWrapper>
    </a.DetailContainer>
  );
};

export default Transaction;
