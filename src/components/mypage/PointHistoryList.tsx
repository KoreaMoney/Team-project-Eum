import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { getTradePoint } from '../../api';
import { auth } from '../../firebase/Firebase';

const PointHistoryList = () => {
  const queryClient = useQueryClient();

  const {
    isLoading: getTradeListLoading,
    isError: getTradeListIsError,
    data: tradeData,
    error: getTradeListError,
  } = useQuery(['onSalePosts'], getTradePoint);

  const buyTradeList =
    tradeData?.data &&
    tradeData.data.filter((user: any) => {
      return auth.currentUser?.uid === user.buyerUid;
    });

  const sellTradeList =
    tradeData?.data &&
    tradeData.data.filter((user: any) => {
      return auth.currentUser?.uid === user.sellerUid;
    });
  return (
    <PointHistoryContainer>
      <PointHistoryCategoryWrapper>
        <PointHistoryAllList>전체</PointHistoryAllList>
        <PointHistorySellList>판매</PointHistorySellList>
        <PointHistoryBuyList>구매</PointHistoryBuyList>
      </PointHistoryCategoryWrapper>
      <PointHistoryWrapper>
        <PointHistory>
          <PointHistoryDate>2.14</PointHistoryDate>
          <PointHistoryContent>인스타그램 친구추가</PointHistoryContent>
          <PointHistoryAmount>200P</PointHistoryAmount>
        </PointHistory>
        <PointHistory>
          <PointHistoryDate>2.12</PointHistoryDate>
          <PointHistoryContent>수학문제 풀이</PointHistoryContent>
          <PointHistoryAmount>300P</PointHistoryAmount>
        </PointHistory>
      </PointHistoryWrapper>
    </PointHistoryContainer>
  );
};

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

export default PointHistoryList;
