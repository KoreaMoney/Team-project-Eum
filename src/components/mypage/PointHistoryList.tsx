import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { getOnSalePosts } from '../../api';
import { theme } from '../../styles/theme';
import { CustomModal } from '../modal/CustomModal';

import styled from 'styled-components';
import Loader from '../etc/Loader';
import Chart from './Chart';

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

  const [isModalActive, setIsModalActive] = useState(false);
  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  return (
    <div>
      <DropWrapper>
        <DropDown>
          <DropDownBtn>
            <div>{category}</div>
            <img src="/assets/Vector.png" alt="" decoding="async" />
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
        <ChartBtn onClick={onClickToggleModal} />
        {isModalActive ? (
          <CustomModal
            modal={isModalActive}
            setModal={setIsModalActive}
            width="700"
            height="500"
            overflow="scroll"
            element={
              <div>
                <Chart />
              </div>
            }
          />
        ) : (
          ''
        )}
      </DropWrapper>
      <PointHistoryWrapper>
        {getTradeListLoading ? (
          <Loader />
        ) : category === '전체' ? (
          NewTradeList?.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointOtherWrapper>
                <PointHistoryDate>
                  {prev.buyerUid === saveUser.uid
                    ? '출금'
                    : prev.sellerUid
                    ? '입금'
                    : '에러'}
                </PointHistoryDate>
                {prev.buyerUid === saveUser.uid ? (
                  <PointHistoryContent>
                    <span>제목 : {prev.title}</span>
                    <p>닉네임 : {prev.buyerNickName}</p>
                  </PointHistoryContent>
                ) : prev.sellerUid ? (
                  <PointHistoryContent>
                    <span>제목 : {prev.title}</span>
                    <p>닉네임 : {prev.buyerNickName}</p>
                  </PointHistoryContent>
                ) : (
                  '에러'
                )}
              </PointOtherWrapper>
              <PointHistoryAmount>
                {prev.buyerUid === saveUser.uid ? (
                  <PlusOrMinus>-</PlusOrMinus>
                ) : prev.sellerUid ? (
                  <PlusOrMinus>+</PlusOrMinus>
                ) : (
                  '에러'
                )}
                {prev.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P
              </PointHistoryAmount>
            </PointHistory>
          ))
        ) : category === '입금' ? (
          sellTradeList?.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointOtherWrapper>
                <PointHistoryDate>
                  {getTradeDate(prev.createdAt)}
                </PointHistoryDate>
                <PointHistoryContent>
                  <span>제목 : {prev.title}</span>
                  <p>닉네임 : {prev.buyerNickName}</p>
                </PointHistoryContent>
              </PointOtherWrapper>
              <PointHistoryAmount>
                +{prev.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P
              </PointHistoryAmount>
            </PointHistory>
          ))
        ) : category === '출금' && buyTradeList ? (
          buyTradeList.map((prev: any) => (
            <PointHistory key={prev.id}>
              <PointOtherWrapper>
                <PointHistoryDate>
                  {getTradeDate(prev.createdAt)}
                </PointHistoryDate>
                <PointHistoryContent>
                  <span>제목 : {prev.title}</span>
                  <p>닉네임 : {prev.sellerNickName}</p>
                </PointHistoryContent>
              </PointOtherWrapper>
              <PointHistoryAmount>
                -{prev.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P
              </PointHistoryAmount>
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

const DropWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 588px;
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

const ChartBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  outline: none;
  border: none;
  border-radius: 100%;
  background-color: transparent;
  background: url('https://ifh.cc/g/mG2V9n.png') no-repeat;
  background-size: cover;
  &:hover {
    cursor: pointer;
    background: url('https://ifh.cc/g/OyFgOq.png') no-repeat;
    background-size: cover;
  }
  &:active {
    background: url('https://ifh.cc/g/mG2V9n.png') no-repeat;
    background-size: cover;
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
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  width: 588px;
  height: auto;
  gap: 20px;
  font-size: ${theme.fontSize.title16};
  font-weight: ${theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray30};
`;

const PointHistory = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 59px;
  border-bottom: 1px solid ${theme.colors.gray10};
`;

const PointOtherWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80%;
`;

const PointHistoryDate = styled.div`
  width: 10rem;
  display: flex;
`;

const PointHistoryContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  p {
    margin-top: 10px;
  }
`;

const PointHistoryAmount = styled.div`
  display: flex;
  align-items: center;
  width: 6rem;
`;
