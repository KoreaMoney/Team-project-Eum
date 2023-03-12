import { useMemo, useState } from 'react';
import { commentType } from '../../types';
import { useRecoilValue } from 'recoil';
import { userCommentsAtom } from '../../atom';

import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

/**순서
 * 1. 저장된 유저 정보 가져오기
 * 2. 유저의 UID값 가져오기
 * 3. 무한 스크롤 구현하기
 */
const UserComments = () => {
  const userComments = useRecoilValue(userCommentsAtom);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 5;
  /**댓글 작성 시간을 n분전 으로 출력해주는 함수
   * 7일 이상이 된 댓글은 yyyy-mm-dd hh:mm 형식으로 출력
   */
  const getTimeGap = (posting: number) => {
    const msGap = Date.now() - posting;
    const minuteGap = Math.floor(msGap / 60000);
    const hourGap = Math.floor(msGap / 3600000);
    if (msGap < 0) {
      return '방금 전';
    }
    if (hourGap > 24) {
      const time = new Date(posting);
      const timeGap = time.toJSON().substring(0, 10);
      return timeGap;
    }
    if (minuteGap > 59) {
      return `${hourGap}시간 전`;
    } else {
      if (minuteGap === 0) {
        return '방금 전';
      } else {
        return `${minuteGap}분 전`;
      }
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const currentPageComments = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return userComments?.slice(startIndex, endIndex);
  }, [currentPage, userComments]);

  return (
    <div>
      <CommentsContainer>
        <CommentTitleText>매칭 후기 ({userComments?.length})</CommentTitleText>
        {currentPageComments?.map((comment: commentType) => (
          <CommentContainer key={comment.id}>
            <TopContainer>
              <NickName>{comment.writerNickName}</NickName>
              <CreateAt>{getTimeGap(comment.createAt)}</CreateAt>
            </TopContainer>
            <RightContainer>
              <CommentContent>{comment.content}</CommentContent>
            </RightContainer>
          </CommentContainer>
        ))}
      </CommentsContainer>
      {userComments && (
        <PaginationContainer>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            pageCount={Math.max(
              Math.ceil(userComments?.length / itemsPerPage),
              1
            )}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </PaginationContainer>
      )}
    </div>
  );
};

export default UserComments;

const CommentTitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  padding-bottom: 28px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1199px;
`;

const CommentContainer = styled.div`
  height: 135px;
  display: flex;
  align-items: left;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

const TopContainer = styled.div`
  display: flex;
`;

const NickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray50};
  padding-right: 16px;
  border-right: 1px solid ${(props) => props.theme.colors.gray20};
  margin-bottom: 16px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentContent = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray30};
`;

const CreateAt = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray30};
  margin-left: 16px;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 80px;

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    border-radius: 0.5rem;
    font-size: 1;
    margin-bottom: 200px;
    li {
      margin: 0;
      padding: 0;

      a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        margin: 0 0.5rem;
        color: ${(props) => props.theme.colors.orange02Main};
        text-decoration: none;
        font-size: ${(props) => props.theme.fontSize.title18};
        font-weight: ${(props) => props.theme.fontWeight.bold};
        transition: all 0.2s ease-in-out;
        cursor: pointer;

        &:hover {
          color: ${(props) => props.theme.colors.orange01};
        }
      }
    }
  }
`;
