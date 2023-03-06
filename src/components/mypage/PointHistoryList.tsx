import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import { getOnSalePosts } from '../../api';
import { theme } from '../../styles/theme';
import Loader from '../etc/Loader';

/**순서
 *1. 완료된 리스트 분류하기
 *2. 판매목록보기
 *3. 구매목록보기
 *4. 전체거래 목록 보기
 */
const PointHistoryList = () => {
  const [category, setCategory] = useState('전체');
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
    color: `${theme.colors.orange02Main}`,
    backgroundColor: `${theme.colors.white}`,
  };

  return (
    <div>
      <DropDown>
        <DropDownBtn>
          <div>{category}</div>
          <img src="/assets/Vector.png" />
        </DropDownBtn>
        <DropDownBox className="DropDownBox">
          <PointWrapper
            onClick={() => setCategory('전체')}
            style={category === '전체' ? categoryStyle : undefined}
            aria-label="전체"
          >
            전체
          </PointWrapper>
          <PointWrapper
            onClick={() => setCategory('입금')}
            style={category === '입금' ? categoryStyle : undefined}
            aria-label="입금"
          >
            입금
          </PointWrapper>
          <PointWrapper
            onClick={() => setCategory('출금')}
            style={category === '출금' ? categoryStyle : undefined}
            aria-label="출금"
          >
            출금
          </PointWrapper>
        </DropDownBox>
      </DropDown>
      <PointHistoryWrapper>
        {getTradeListLoading ? (
          <div>
            <Loader />
          </div>
        ) : category === '전체' ? (
          NewTradeList?.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointHistoryDate>
                {prev.buyerUid === saveUser.uid
                  ? '출금'
                  : prev.sellerUid
                  ? '입금'
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
        ) : category === '입금' ? (
          sellTradeList?.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointHistoryDate>
                {getTradeDate(prev.createdAt)}
              </PointHistoryDate>
              <PointHistoryContent>{prev.title}</PointHistoryContent>
              <PointHistoryAmount>+{prev.price}</PointHistoryAmount>
            </PointHistory>
          ))
        ) : category === '출금' && buyTradeList ? (
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

const DropDown = styled.div`
  width: 68px;
  height: 27px;
  position: relative;
  display: inline-block;
  margin-bottom: 48px;
  &:hover {
    .DropDownBox {
      display: flex;
    }
  }
`;

const DropDownBtn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 68px;
  height: 27px;
  color: ${theme.colors.black};
  font-size: ${theme.fontSize.title18};
  font-weight: ${theme.fontWeight.medium};
  &:hover {
    cursor: pointer;
    color: ${theme.colors.gray30};
  }
`;

const DropDownBox = styled.div`
  position: absolute;
  display: none;
  flex-direction: column;
  justify-content: space-around;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray20};
  border-radius: 10px;
  z-index: 1;
  height: 192px;
  width: 170px;
  right: 0;
`;

const PointWrapper = styled.button`
  width: 100%;
  height: 32px;
  font-size: ${theme.fontSize.title20};
  font-weight: ${theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.black};
  border: none;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.orange02Main};
    background-color: ${theme.colors.white};
  }
`;

const PlusOrMinus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PointHistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 588px;
  height: auto;
  gap: 24px;
  font-size: ${theme.fontSize.title16};
  font-weight: ${theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray30};
`;

const PointHistory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 59px;
`;

const PointHistoryDate = styled.div`
  width: 10rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
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
