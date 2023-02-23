import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import { getTradePoint } from '../../api';
import { auth } from '../../firebase/Firebase';

const PointHistoryList = () => {
  const queryClient = useQueryClient();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const [category, setCategoey] = useState('all');

  // 거래 목록을 받아옵니다.

  const {
    isLoading: getTradeListLoading,
    isError: getTradeListIsError,
    data: tradeData,
    error: getTradeListError,
  } = useQuery(['onSalePosts'], getTradePoint);


  // 거래 완료 목록을 받아옵니다.
  const isDoneTradeList =
    tradeData?.data &&
    tradeData.data.filter((post: any) => {
      return post.isDone === true;
    });


  // 완료 목록 중 로그인 한 유저가 판매자 or 구매자인 목록을 나타냅니다.
  const allTradeList = isDoneTradeList?.filter((user: any) => {
    return auth?.currentUser?.uid === (user?.sellerUid || user?.buyerUid);
  });

  // 완료 목록 중 로그인 한 유저가 판매자인 목록을 나타냅니다.
  const sellTradeList = isDoneTradeList?.filter((user: any) => {
    return auth?.currentUser?.uid === user?.sellerUid;
  });

  // 완료 목록 중 로그인 한 유저가 구매자인 목록을 나타냅니다.
  const buyTradeList = isDoneTradeList?.filter((user: any) => {
    return auth?.currentUser?.uid === user?.buyerUid;
  });

  // 포인트모달창 내의 nav클릭시 스타일을 지정합니다.
  const categoryStyle = {
    border: 'none',
    borderBottom: '2px solid #000000',
    color: '#000000',
  };


  return (
    <PointHistoryContainer>
      <PointHistoryCategoryWrapper>

        <PointHistoryAllList
          onClick={() => setCategoey('all')}
          style={category === 'all' ? categoryStyle : undefined}
        >
          전체
        </PointHistoryAllList>
        <PointHistorySellList
          onClick={() => setCategoey('sell')}
          style={category === 'sell' ? categoryStyle : undefined}
        >
          판매
        </PointHistorySellList>
        <PointHistoryBuyList
          onClick={() => setCategoey('buy')}
          style={category === 'buy' ? categoryStyle : undefined}
        >
          구매
        </PointHistoryBuyList>
      </PointHistoryCategoryWrapper>
      <PointHistoryWrapper>

        {category === 'all'
          ? allTradeList?.map((list: any) => {
              return (
                <PointHistory key={list.id}>
                  <PointHistoryDate>{list.createdAt}</PointHistoryDate>
                  <PointHistoryContent>{list.title}</PointHistoryContent>
                  <PointHistoryAmount>{list.price}</PointHistoryAmount>
                </PointHistory>
              );
            })
          : null}
        {category === 'sell'
          ? sellTradeList?.map((list: any) => {
              return (
                <PointHistory key={list.id}>
                  <PointHistoryDate>{list.createdAt}</PointHistoryDate>
                  <PointHistoryContent>{list.title}</PointHistoryContent>
                  <PointHistoryAmount>{list.price}</PointHistoryAmount>
                </PointHistory>
              );
            })
          : null}
        {category === 'buy'
          ? buyTradeList?.map((list: any) => {
              return (
                <PointHistory key={list.id}>
                  <PointHistoryDate>{list.createdAt}</PointHistoryDate>
                  <PointHistoryContent>{list.title}</PointHistoryContent>
                  <PointHistoryAmount>{list.price}</PointHistoryAmount>
                </PointHistory>
              );
            })
          : null}
      </PointHistoryWrapper>
    </PointHistoryContainer>
  );
};
export default PointHistoryList;

const BuyOrSellerText = styled.span`
  
`
const PlusOrMinus = styled.span`
  
`
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


