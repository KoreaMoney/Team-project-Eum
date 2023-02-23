import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getTradePoint } from '../../api';
import styled from 'styled-components';

/**순서
 * 1. 거래 List작성하기
 * 2.
 */

const PointHistoryList = () => {
  const [category, setCategory] = useState(0);

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const { isLoading: getTradeListLoading, data: tradeData } = useQuery(
    ['onSalePosts'],
    getTradePoint
  );

  //거래 List작성하기
  const buyTradeList =
    tradeData &&
    tradeData.filter((user: any) => {
      return saveUser?.uid === user?.buyerUid;
    });

  //판매 List작성하기
  const sellTradeList =
    tradeData &&
    tradeData.filter((user: any) => {
      return saveUser?.uid === user?.sellerUid;
    });

  //새로운 거래 List
  let NewTradeList;
  if (buyTradeList && sellTradeList) {
    NewTradeList = [...buyTradeList, ...sellTradeList];
  } else {
    NewTradeList = undefined;
  }

  return (
    <PointHistoryContainer>
      <PointHistoryCategoryWrapper>
        <PointWrapper onClick={() => setCategory(0)}>전체</PointWrapper>
        <PointWrapper onClick={() => setCategory(1)}>판매</PointWrapper>
        <PointWrapper onClick={() => setCategory(2)}>구매</PointWrapper>
      </PointHistoryCategoryWrapper>
      <PointHistoryWrapper>
        {getTradeListLoading ? (
          <div>Loading...</div>
        ) : category === 0 ? (
          NewTradeList?.map((prev: any) => (
            <PointHistory key={prev.id}>
              {prev.buyerUid === saveUser.uid ? (
                <BuyOrSellerText>구매</BuyOrSellerText>
              ) : prev.sellerUid ? (
                <BuyOrSellerText>판매</BuyOrSellerText>
              ) : (
                '에러'
              )}
              <PointHistoryDate>{prev.createAt}</PointHistoryDate>
              <PointHistoryContent>{prev.title}</PointHistoryContent>
              <PointHistoryAmount>
                {prev.buyerUid === saveUser.uid ? (
                  <PlusOrMinus>-</PlusOrMinus>
                ) : prev.sellerUid ? (
                  <PlusOrMinus>+</PlusOrMinus>
                ) : (
                  '에러'
                )}
                {prev.price}
              </PointHistoryAmount>
            </PointHistory>
          ))
        ) : category === 1 ? (
          sellTradeList?.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointHistoryDate>{prev.createAt}</PointHistoryDate>
              <PointHistoryContent>{prev.title}</PointHistoryContent>
              <PointHistoryAmount>+{prev.price}</PointHistoryAmount>
            </PointHistory>
          ))
        ) : category === 2 && buyTradeList ? (
          buyTradeList.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointHistoryDate>{prev.createAt}</PointHistoryDate>
              <PointHistoryContent>{prev.title}</PointHistoryContent>
              <PointHistoryAmount>-{prev.price}</PointHistoryAmount>
            </PointHistory>
          ))
        ) : (
          <>Error</>
        )}
      </PointHistoryWrapper>
    </PointHistoryContainer>
  );
};
export default PointHistoryList;

const PointHistoryContainer = styled.div``;
const PointHistoryCategoryWrapper = styled.div``;
const PointWrapper = styled.button`
  width: 8rem;
  height: 32px;
  font-size: 100%;
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray10};
  border: none;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray10};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.gray30};
    border-bottom: 2px solid ${(props) => props.theme.colors.gray30};
  }
`;

const PointHistoryWrapper = styled.div`
  margin: 12px 0;
  margin-bottom: 24px;
  padding: 12px 24px;
  width: 100%;
  height: 360px;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  overflow-y: auto;
`;

const PlusOrMinus = styled.span``;
const BuyOrSellerText = styled.span``;
const PointHistory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
  width: 100%;
  height: 1.5rem;
  font-size: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;
const PointHistoryDate = styled.p`
  width: 20%;
`;
const PointHistoryContent = styled.p`
  width: 65%;
`;
const PointHistoryAmount = styled.p`
  width: 15%;
`;
