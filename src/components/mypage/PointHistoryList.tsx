import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import { getTradePoint } from '../../api';
import { auth } from '../../firebase/Firebase';

const PointHistoryList = () => {
  const [category, setCategory] = useState(0);
  const queryClient = useQueryClient();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const {
    isLoading: getTradeListLoading,
    isError: getTradeListIsError,
    data: tradeData,
    error: getTradeListError,
  } = useQuery(['onSalePosts'], getTradePoint);

  console.log('tradeData: ', tradeData);

  const buyTradeList =
    tradeData &&
    tradeData.filter((user: any) => {
      return saveUser?.uid === user?.buyerUid;
    });
  console.log('buyTradeList: ', buyTradeList);

  const sellTradeList =
    tradeData &&
    tradeData.filter((user: any) => {
      return saveUser?.uid === user?.sellerUid;
    });
  console.log('sellTradeList: ', sellTradeList);

  let NewTradeList;
  if (buyTradeList && sellTradeList) {
    NewTradeList = [...buyTradeList, ...sellTradeList];
  } else {
    NewTradeList = undefined;
  }

  return (
    <PointHistoryContainer>
      <PointHistoryCategoryWrapper>
        <PointHistoryAllList onClick={() => setCategory(0)}>
          전체
        </PointHistoryAllList>
        <PointHistorySellList onClick={() => setCategory(1)}>
          판매
        </PointHistorySellList>
        <PointHistoryBuyList onClick={() => setCategory(2)}>
          구매
        </PointHistoryBuyList>
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

const BuyOrSellerText = styled.span``;
const PlusOrMinus = styled.span``;
const PointHistoryContainer = styled.div``;

const PointHistoryCategoryWrapper = styled.div``;
const PointHistoryAllList = styled.button`
  width: 8rem;
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
const PointHistorySellList = styled.button`
  width: 8rem;
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
const PointHistoryBuyList = styled.button`
  width: 8rem;
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
const PointHistoryWrapper = styled.div`
  margin: 12px 0;
  padding: 12px 24px;
  width: 100%;
  height: 360px;
  background-color: #d9d9d9;
  color: #737373;
  border-radius: 10px;
  margin-bottom: 24px;
  overflow-y: auto;
`;

const PointHistory = styled.div`
  margin: 12px 0;
  width: 100%;
  height: 1.5rem;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #737373;
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
