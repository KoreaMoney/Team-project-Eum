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
  console.log('tradeData', tradeData);

  const isDoneTradeList =
    tradeData &&
    tradeData.filter((post: any) => {
      return post.isDone === true;
    });
  console.log('isDoneTradeList', isDoneTradeList);

  // 거래완료 목록 중 내 판매목록
  const buyTradeList = isDoneTradeList?.filter((user: any) => {
    return saveUser?.uid === user?.buyerUid;
  });
  console.log('buyTradeList', buyTradeList);

  // 거래완료 목룩 중 내 구매목록
  const sellTradeList = isDoneTradeList?.filter((user: any) => {
    return saveUser?.uid === user?.sellerUid;
  });
  console.log('sellTradeList', sellTradeList);

  // 내 전체 거래 목록
  let NewTradeList;
  if (buyTradeList && sellTradeList) {
    NewTradeList = [...buyTradeList, ...sellTradeList];
  } else {
    NewTradeList = undefined;
  }
  console.log('NewTradeList', NewTradeList);

  const categoryStyle = {
    color: `#656565`,
    borderBottom: `2px solid #666666`,
  };
  return (
    <PointHistoryContainer>
      <PointHistoryCategoryWrapper>
        <PointHistoryAllList
          onClick={() => setCategory(0)}
          style={category === 0 ? categoryStyle : undefined}
        >
          전체
        </PointHistoryAllList>
        <PointHistorySellList
          onClick={() => setCategory(1)}
          style={category === 1 ? categoryStyle : undefined}
        >
          판매
        </PointHistorySellList>
        <PointHistoryBuyList
          onClick={() => setCategory(2)}
          style={category === 2 ? categoryStyle : undefined}
        >
          구매
        </PointHistoryBuyList>
      </PointHistoryCategoryWrapper>
      <PointHistoryWrapper>
        {getTradeListLoading ? (
          <div>Loading...</div>
        ) : category === 0 ? (
          NewTradeList?.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointHistoryDate>
                {prev.buyerUid === saveUser.uid
                  ? '구매'
                  : prev.sellerUid
                  ? '판매'
                  : '에러'}
              </PointHistoryDate>

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
          <>없음</>
        )}
      </PointHistoryWrapper>
    </PointHistoryContainer>
  );
};
export default PointHistoryList;

const PointHistoryContainer = styled.div``;

const PlusOrMinus = styled.span`
  width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
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
  margin: 1rem 0;
  width: 100%;
  height: 1.5rem;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #737373;
`;
const PointHistoryDate = styled.div`
  width: 10rem;
  display: flex;
  justify-content: left;
  align-items: center;
`;
const PointHistoryContent = styled.div`
  width: 25rem;
  display: flex;
  justify-content: left;
  align-items: center;
`;
const PointHistoryAmount = styled.div`
  width: 6rem;
  display: flex;
  justify-content: left;
  align-items: center;
`;
