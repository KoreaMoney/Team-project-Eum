import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customConfirm } from '../components/modal/CustomAlert';
import { auth } from '../firebase/Firebase';
import styled from 'styled-components';
import SignIn from './SignIn';
import parse from 'html-react-parser';
import basicIMG from '../styles/basicIMG.png';

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
      console.log(1);
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
      <EditDeleteButtonContainer>
      
      </EditDeleteButtonContainer>
      <PostContainer>
        <PostImage img={data?.[0]?.imgURL} />
        <PostInfoWrapper>
          <TitleText>{data?.[0]?.title}</TitleText>
          <PostPrice>{data?.[0]?.price} 원</PostPrice>
          <SellerText>판매자</SellerText>
          <SellerProfileContainer>
            <SellerProfileTopDiv>
              <TopLeftContainer>
                <ProfileIMG
                  profileIMG={
                    sellerData?.profileImg ? sellerData?.profileImg : basicIMG
                  }
                />
              </TopLeftContainer>
              <TopRightContainer>
                <SellerNickName>{sellerData?.nickName}</SellerNickName>
              </TopRightContainer>
            </SellerProfileTopDiv>
            <SellerProfileBottomDiv>
              <BottomTopContainer>
                <ContactTimeContainer>
                  <ContactTimeTitleText>연락가능시간</ContactTimeTitleText>
                  <ContactTimeContentText>
                    {sellerData?.contactTime
                      ? sellerData?.contactTime
                      : '00:00 ~ 24:00'}
                  </ContactTimeContentText>
                </ContactTimeContainer>
              </BottomTopContainer>
              <BottomBottomContainer>
                <ProfileButtonContainer>
                  <ProfileButtons>판매상품 10개</ProfileButtons>
                  <ProfileButtons>받은 후기</ProfileButtons>
                </ProfileButtonContainer>
              </BottomBottomContainer>
            </SellerProfileBottomDiv>
          </SellerProfileContainer>
          {saveUser.uid === data?.[0]?.buyerUid ||
          saveUser.uid === data?.[0]?.sellerUid ? (
            <LikeAndSubmitContainer>
              {saveUser.uid === data?.[0]?.buyerUid ? (
                <OrderButton onClick={onClickClearRequest}>완료</OrderButton>
              ) : null}
              <OrderButton onClick={onClickCancel}>거래 취소</OrderButton>
            </LikeAndSubmitContainer>
          ) : null}
        </PostInfoWrapper>
      </PostContainer>
      <PostContentWrapper>
        <PostContent>{parse(data?.[0]?.content)}</PostContent>
      </PostContentWrapper>
    </DetailContainer>
  );
};

export default Transaction;

const DetailContainer = styled.div`
  width: 60%;
  margin: 0 auto;
`;

const ClearDivContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ClearText = styled.h1`
  text-align: center;
  font-weight: 800;
  font-size: 50px;
`;

const EditDeleteButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const PostContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4rem;
  margin-bottom: 24px;
`;

const PostImage = styled.div<{ img: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 490px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.gray10};
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.img});
`;

const PostInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  height: 490px;
`;

const TopRightContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 70%;
  margin-bottom: 0.5rem;
`;

const TitleText = styled.h2`
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
`;

const PostPrice = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontSize.bottom20};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  text-align: right;
`;

const SellerText = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;

const SellerProfileContainer = styled.div`
  width: 100%;
  height: 240px;
  box-shadow: 1px 1px 5px ${(props) => props.theme.colors.gray20};
`;

const SellerProfileTopDiv = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  background-color: rgba(255, 218, 24, 0.8);
`;

const TopLeftContainer = styled.div`
  position: relative;
  width: 30%;
`;

const SellerNickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;

const ProfileIMG = styled.div<{ profileIMG: string }>`
  position: absolute;
  width: 100px;
  height: 100px;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const SellerProfileBottomDiv = styled.div`
  width: 100%;
  height: 11rem;
`;

const BottomTopContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: flex-start;
  height: 50%;
`;

const ContactTimeContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 0.7rem 1.5rem;
  gap: 0.5rem;
`;

const ContactTimeTitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
`;

const ContactTimeContentText = styled.span`
  font-size: ${(props) => props.theme.fontSize.label12};
  color: ${(props) => props.theme.colors.gray20};
`;

const BottomBottomContainer = styled.div`
  height: 50%;
`;

const ProfileButtonContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
`;

const ProfileButtons = styled.button`
  width: 100%;
  height: 64px;
  font-size: ${(props) => props.theme.fontSize.body16};
  background-color: ${(props) => props.theme.colors.brandColor};
  border: none;
  &:hover {
    box-shadow: 2px 2px 4px #d5d5d5;
  }
`;

const LikeAndSubmitContainer = styled.div`
  display: flex;
  gap: 3rem;
`;

const OrderButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 4rem;
  color: ${(props) => props.theme.colors.gray40};
  font-size: ${(props) => props.theme.fontSize.bottom20};
  background-color: ${(props) => props.theme.colors.brandColor};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 3px ${(props) => props.theme.colors.gray20};
  }
`;

const PostContentWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  gap: 2.5rem;
  margin-bottom: 24px;
`;

const PostContent = styled.div`
  padding: 2rem;
  width: 100%;
  min-height: 20rem;
  border: 2px solid ${(props) => props.theme.colors.brandColor};
`;

const EditDeleteButton = styled.button`
  width: 5rem;
  height: 2.5rem;
  border: none;
  font-size: ${(props) => props.theme.fontSize.bottom20};
  background-color: ${(props) => props.theme.colors.brandColor};
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 3px ${(props) => props.theme.colors.gray20};
  }
`;
