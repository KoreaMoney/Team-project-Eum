import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getUsers, patchOnSalePost, patchUsers } from '../../../api';
import { isCancelAtom, isDoneAtom, onSalePostAtom } from '../../../atom';
import { userType } from '../../../types';
import {
  customConfirm,
  customInfoAlert,
  customSuccessAlert,
} from '../../modal/CustomAlert';

import * as a from '../../detail/PostInfo/PostInfoStyle';
import * as b from './PostInfoStyle';

const PostInfo = () => {
  const navigate = useNavigate();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const queryClient = useQueryClient();

  const { uuid } = useParams();

  const data = useRecoilValue(onSalePostAtom);
  const [isDone, setIsDone] = useRecoilState(isDoneAtom);
  const [isCancel, setIsCancel] = useRecoilState(isCancelAtom);
  const [buyerIsCancel, setBuyerIsCancel] = useState(data?.[0]?.isBuyerCancel);

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

  /**판매자,구매자가 취소버튼을 누르면 실행되는 함수 */
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

  /**거래완료 시 판매자의 포인트를 더해줍니다. */
  const { mutate: updateUser } = useMutation(
    (newUser: { point: number; isDoneCount: number }) =>
      patchUsers(data?.[0]?.sellerUid, newUser),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['sellerData', sellerData?.id]),
    }
  );
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

  /**거래가 완료되면 isDone을 true로 만들어줍니다. */
  const { mutate: clearRequest } = useMutation(
    (newSalePosts: { isDone: boolean; doneTime: number }) =>
      patchOnSalePost(uuid, newSalePosts),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['salePost1', uuid]);
        setIsDone(true);
        navigate(`/review/${data?.[0].id}`);
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

  /**판매자가 취소 눌렀을 때 */
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

  /**구매자가 취소 눌렀을 때 */
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

  /**구매자,판매자 둘다 취소를 눌렀을 때 */
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

  /**최종 취소 시 구매자에게 포인트 환불*/
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

  /**구매자가 완료버튼을 클릭했을 때 실행되는 함수 */
  const onClickClearRequest = () => {
    customConfirm(
      '매칭 하시겠습니까?',
      '매칭이 완료되면, 판매자에게 포인트가 지급됩니다.',
      '완료',
      () => {
        /**글의 카테고리와 같은 데이터에 +1 카운트 */
        let categoryCount;
        if (data?.[0].category === 'study') {
          categoryCount = { study: (sellerData?.study ?? 0) + 1 };
        } else if (data?.[0].category === 'play') {
          categoryCount = { play: (sellerData?.play ?? 0) + 1 };
        } else if (data?.[0].category === 'advice') {
          categoryCount = { advice: (sellerData?.advice ?? 0) + 1 };
        } else {
          categoryCount = { etc: (sellerData?.etc ?? 0) + 1 };
        }
        /**판매자의 판매량을 +1 카운트 */
        updateUser({
          point: Number(sellerData?.point) + Number(data?.[0]?.price),
          isDoneCount: (sellerData?.isDoneCount ?? 0) + 1,
          ...categoryCount,
        });
        /**완료된 것을 확정 및 완료시간을 추가 */
        clearRequest({
          isDone: true,
          doneTime: Date.now(),
        });
      }
    );
  };

  return (
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
            <a.ShareIcon onClick={linkCopy} aria-label="링크 복사하기" />
          </a.IconRightContainer>
        </a.InfoTopRightContainer>
      </a.InfoTopContainer>
      <a.TextContainer>
        <a.TitleText>{data?.[0].title}</a.TitleText>
      </a.TextContainer>
      <a.PostNickName>{data?.[0].sellerNickName}</a.PostNickName>
      <a.PostPrice>
        {data?.[0]?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P
      </a.PostPrice>

      {saveUser.uid === data?.[0]?.buyerUid ||
      saveUser.uid === data?.[0]?.sellerUid ? (
        <>
          {buyerIsCancel || data?.[0].isBuyerCancel ? (
            <>
              {saveUser.uid === data?.[0]?.buyerUid ? (
                <>
                  <b.ButtonsContainer>
                    <b.ClearButton
                      onClick={() =>
                        customInfoAlert(
                          '구매자, 판매자 전부 취소버튼을 \n\n눌러야 취소됩니다.'
                        )
                      }
                      aria-label="취소를 기다리는중"
                    >
                      판매자의 동의를 기다리고있습니다.
                    </b.ClearButton>
                  </b.ButtonsContainer>
                </>
              ) : (
                <>
                  {isDone ? (
                    <b.CancelButton aria-label="매칭종료">
                      매칭종료
                    </b.CancelButton>
                  ) : (
                    <b.CancelButton
                      onClick={() => {
                        onClickCancel();
                      }}
                      aria-label="매칭취소"
                    >
                      매칭취소
                    </b.CancelButton>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <b.ButtonsContainer>
                {saveUser.uid === data?.[0].buyerUid && !isCancel ? (
                  <b.ClearButton
                    onClick={onClickClearRequest}
                    aria-label="완료"
                  >
                    매칭완료
                  </b.ClearButton>
                ) : saveUser.uid === data?.[0]?.buyerUid && isCancel ? (
                  <b.ClearButton aria-label="매칭 완료">
                    매칭 완료
                  </b.ClearButton>
                ) : null}

                {isDone ? (
                  <b.CancelButton aria-label="매칭종료">
                    매칭종료
                  </b.CancelButton>
                ) : (
                  <b.CancelButton
                    onClick={() => {
                      onClickCancel();
                    }}
                    aria-label="매칭취소"
                  >
                    매칭취소
                  </b.CancelButton>
                )}
              </b.ButtonsContainer>
            </>
          )}
        </>
      ) : null}
    </a.PostInfoWrapper>
  );
};

export default PostInfo;
