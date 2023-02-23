import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  customConfirm,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import { auth } from '../firebase/Firebase';
import SignIn from './SignIn';

const Transaction = () => {
  const { id } = useParams();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(false);
  const queryClient = useQueryClient();
  auth.onAuthStateChanged((user: any) => setCurrent(user?.uid));
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const { data, isLoading } = useQuery(['salePost', id], async () => {
    // 쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
    const response = await axios.get(
      `${process.env.REACT_APP_JSON}/onSalePosts?id=${id}`
    );
    return response.data;
  });
console.log( 'data: ' ,data);


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
  console.log('sellerData: ', sellerData);

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
    (newUser: { point: string; isDoneCount: number }) =>
      axios.patch(

        `${process.env.REACT_APP_JSON}/users/${data?.[0].sellerUid}`,

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
    (newSalePost: {
      isSellerCancel: boolean;
      isBuyerCancel: boolean;
    }) =>
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
  // console.log('data?.[0].buyerUid: ', data?.[0].buyerUid);

  // 구매자가 완료버튼을 누르면 판매자에게 price만큼 포인트를 더해주고,
  // 등급을 위한 user의 isDoneCount 데이터도 +1을 해줍니다.
  // isDone도 true로 변경되어 판매,구매가 완료됩니다.
  const onClickClearRequest = async () => {
    await updateUser({
      point: String(Number(sellerData.point) + Number(data?.[0]?.price)),
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

        console.log('😀data[0].isSellerCancel: ', data?.[0]?.isSellerCancel);
        console.log('😀data[0].isBuyerCancel: ', data?.[0]?.isBuyerCancel);

        console.log('😀data[0].price: ', data?.[0]?.price);
      }
    );
  };

  // 둘다 취소하면 포인트를 구매자에게 돌려줍니다.
  useEffect(() => {
    if (data?.[0]?.isSellerCancel && data?.[0]?.isBuyerCancel) {
      console.log(1);
      giveBackPoint({
        point: String(Number(buyerData?.point) + Number(data?.[0]?.price)),
      });
    }
  }, [data]);

  if (isLoading) {
    console.log('로딩중');
    return <div>Lodding...</div>;
  }
  if (!data || data.length === 0) {
    console.log('데이터없음');
    return <div>Mo data found</div>;
  }
  if (!saveUser) {
    return <SignIn />;
  }
  return (
    <>
      <DetailContainer>
        {data?.[0]?.isDone && (
          <ClearDivContainer>
            <ClearText>거래가 완료되었습니다.</ClearText>
          </ClearDivContainer>
        )}
        {data?.[0]?.isSellerCancel && data?.[0]?.isBuyerCancel && (
          <ClearDivContainer>
            <ClearText>거래가 취소되었습니다.</ClearText>
          </ClearDivContainer>
        )}
        <PostContainer>
          <PostImage>사진 혹은 영상</PostImage>
          <PostInfoWrapper>
            <SellBuyWrapper>
              <SellButton>팝니다</SellButton>
              <BuyButton>삽니다</BuyButton>
            </SellBuyWrapper>
            <PostTitle>
              <p>제목:{data?.[0]?.title}</p>
            </PostTitle>
            <PostPrice>
              <p>가격:{data?.[0]?.price}</p>
            </PostPrice>
            <CancelCompleteButtonContainer>
              {saveUser?.uid === data?.[0]?.buyerUid ||
              saveUser?.uid === data?.[0]?.sellerUid ? (
                <PostLikeButton>찜</PostLikeButton>
              ) : (
                <PostLikeButton></PostLikeButton>
              )}
              {saveUser?.uid === data?.[0]?.buyerUid ? (
                <ClearButton onClick={onClickClearRequest}>완료</ClearButton>
              ) : null}
            </CancelCompleteButtonContainer>
            {saveUser?.uid === data?.[0]?.buyerUid ||
            saveUser?.uid === data?.[0]?.sellerUid ? (
              <CancelButton onClick={onClickCancel}>취소요청</CancelButton>
            ) : (
              <CancelButton></CancelButton>
            )}
          </PostInfoWrapper>
        </PostContainer>
        <PostContentWrapper>
          <PostContent>
            <p>내용:{data?.[0]?.content}</p>
          </PostContent>
          <PostUserInfo>
            <p>카테고리:{data?.[0]?.category}</p>
            <p>닉네임:{data?.[0]?.nickName}</p>
            <p>조회수:{data?.[0]?.views}</p>
          </PostUserInfo>
        </PostContentWrapper>
      </DetailContainer>
      <CommentsWrapper>
        <p>채팅들어갈곳</p>
      </CommentsWrapper>
    </>
  );
};

export default Transaction;

const ClearDivContainer = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 53%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ClearText = styled.h1`
  text-align: center;
  font-weight: 800;
  font-size: 50px;
`;
const DetailContainer = styled.div`
  padding: 40px;
  width: 100%;
`;

const PostContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const PostImage = styled.div`
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CancelCompleteButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;
const PostInfoWrapper = styled.div`
  width: 50%;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SellBuyWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SellButton = styled.button`
  width: 50%;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #cccccc;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;

const BuyButton = styled.button`
  width: 50%;
  height: 32px;
  font-size: 100%;
  background-color: #ffffff;
  color: #cccccc;
  border: none;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
    cursor: pointer;
    background-color: #ffffff;
    color: #656565;
    border-bottom: 2px solid #666666;
  }
`;

const PostTitle = styled.div`
  width: 100%;
  height: 48px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostPrice = styled.div`
  width: 100%;
  height: 48px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostLikeButton = styled.button`
  width: 100px;
  height: 72px;
  font-size: 100%;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const ClearButton = styled.button`
  width: 65%;
  height: 72px;
  font-size: 100%;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  height: 48px;
  font-size: 100%;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const CompleteButton = styled.button`
  width: 100%;
  height: 48px;
  font-size: 100%;
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const PostContentWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const PostContent = styled.div`
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostUserInfo = styled.div`
  padding: 12px;
  width: 50%;
  height: 320px;
  background-color: lightgray;
  color: #656565;
  border-radius: 10px;
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;

const CommentsWrapper = styled.div`
  padding: 12px;
  width: 100%;
  /* height: 320px; */
  background-color: lightgray;
  color: #656565;
  border: none;
  border-radius: 10px;
  /* display: flex;
  justify-content: space-around;
  align-items: center; */
  margin-bottom: 24px;
`;
