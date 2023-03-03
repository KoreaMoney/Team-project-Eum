import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import { getOnSalePosts } from '../../api';
import { theme } from '../../styles/theme';

/**순서
 *1. 완료된 리스트 분류하기
 *2. 판매목록보기
 *3. 구매목록보기
 *4. 전체거래 목록 보기
 */
const PointHistoryList = () => {
  const [category, setCategory] = useState(0);
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const { isLoading: getTradeListLoading, data: tradeData } = useQuery(
    ['onSalePosts'],
    getOnSalePosts
  );

  // 거래완료 목록 출력
  const isDoneTradeList =
    tradeData &&
    tradeData.filter((post: any) => {
      return post.isDone === true;
    });

  // 거래완료 목록 중 내 판매목록
  const buyTradeList = isDoneTradeList?.filter((user: any) => {
    return saveUser?.uid === user?.buyerUid;
  });

  // 거래완료 목룩 중 내 구매목록
  const sellTradeList = isDoneTradeList?.filter((user: any) => {
    return saveUser?.uid === user?.sellerUid;
  });

  // 내 전체 거래 목록
  let NewTradeList;
  if (buyTradeList || sellTradeList) {
    NewTradeList = [...buyTradeList, ...sellTradeList];
  } else {
    NewTradeList = undefined;
  }

  // 거래 일자 출력
  const getTradeDate = (prev: number) => {
    const date = new Date(prev);
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const tradeDate = year + '.' + month + '.' + day;
    return tradeDate;
  };

  // nav 스타일
  const categoryStyle = {
    color: `${theme.colors.white}`,
    borderRadius: `10px`,
    backgroundColor: `${theme.colors.orange01}`,
  };

  return (
    <div>
      <div>
        <PointWrapper
          onClick={() => setCategory(0)}
          style={category === 0 ? categoryStyle : undefined}
          aria-label="전체"
        >
          전체
        </PointWrapper>
        <PointWrapper
          onClick={() => setCategory(1)}
          style={category === 1 ? categoryStyle : undefined}
          aria-label="판매"
        >
          판매
        </PointWrapper>
        <PointWrapper
          onClick={() => setCategory(2)}
          style={category === 2 ? categoryStyle : undefined}
          aria-label="구매"
        >
          구매
        </PointWrapper>
      </div>
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
              <PointHistoryDate>
                {getTradeDate(prev.createdAt)}
              </PointHistoryDate>
              <PointHistoryContent>{prev.title}</PointHistoryContent>
              <PointHistoryAmount>+{prev.price}</PointHistoryAmount>
            </PointHistory>
          ))
        ) : category === 2 && buyTradeList ? (
          buyTradeList.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointHistoryDate>
                {getTradeDate(prev.createdAt)}
              </PointHistoryDate>
              <PointHistoryContent>{prev.title}</PointHistoryContent>
              <PointHistoryAmount>-{prev.price}</PointHistoryAmount>
            </PointHistory>
          ))
        ) : (
          <>없음</>
        )}
      </PointHistoryWrapper>
    </div>
  );
};
export default PointHistoryList;

const PlusOrMinus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PointWrapper = styled.button`
  width: 8rem;
  height: 32px;
  font-size: ${theme.fontSize.title18};
  font-weight: ${theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.gray30};
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray30};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.white};
    border-radius: 10px;
    background-color: ${theme.colors.orange03};
  }
`;

const PointHistoryWrapper = styled.div`
  margin: 12px 0;
  padding: 12px 24px;
  width: 100%;
  height: 360px;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  margin-bottom: 24px;
  overflow-y: auto;
`;
const PointHistory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  width: 100%;
  height: 1.5rem;
  font-size: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray30};
`;
const PointHistoryDate = styled.div`
  width: 10rem;
  display: flex;
  justify-content: left;
  align-items: center;
`;
const PointHistoryContent = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 25rem;
`;
const PointHistoryAmount = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 6rem;
`;
