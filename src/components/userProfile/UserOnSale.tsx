import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { userPostsAtom } from '../../atom';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { postType } from '../../types';

const UserOnSale = () => {
  const navigate = useNavigate();
  const userPosts = useRecoilValue(userPostsAtom);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };
  const currentPagePosts = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return userPosts?.slice(startIndex, endIndex);
  }, [currentPage, userPosts]);

  const onClickMoveDetail = (post:postType) => {
    navigate(`/detail/${post.category}/${post.id}`)
  }
  return (
    <>
      <Title>판매상품 ({userPosts && userPosts.length})</Title>
      <PostsContainer>
        {currentPagePosts?.map((post) => {
          return (
            <PostContainer key={post.id} onClick={()=>onClickMoveDetail(post)}>
              {post.isDone && <ClearPost>거래완료</ClearPost>}
              <PostIMG bgPhoto={post.imgURL} />
              <ContentsContainer>
                <InfoBest>{post.category}</InfoBest>
                <p>{post.title}</p>
                <p>
                  {post.price
                    ? post.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                  P
                </p>
                <span>{post.nickName}</span>
              </ContentsContainer>
            </PostContainer>
          );
        })}
      </PostsContainer>
      {userPosts && (
        <PaginationContainer>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            pageCount={Math.max(Math.ceil(userPosts?.length / itemsPerPage), 1)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </PaginationContainer>
      )}
    </>
  );
};

export default UserOnSale;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  margin-bottom: 48px;
`;

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  height: 718px;
`;

const PostContainer = styled.div`
  width: 100%;
  cursor: pointer;
  position: relative;
`;
const PostIMG = styled.div<{ bgPhoto: string | undefined }>`
  width: 281px;
  height: 199px;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
  margin-bottom: 16px;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 5px 3px ${(props) => props.theme.colors.gray20};
  }
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  p {
    font-size: ${(props) => props.theme.fontSize.title18};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    line-height: ${(props) => props.theme.lineHeight.title18};
  }
  span {
    font-size: ${(props) => props.theme.fontSize.title16};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: ${(props) => props.theme.lineHeight.title16};
    color: ${(props) => props.theme.colors.gray20};
    margin-bottom: 16px;
  }
`;
const InfoBest = styled.div`
  text-decoration: underline;
  color: ${(props) => props.theme.colors.green};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;
const ClearPost = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 282px;
  height: 355px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
  color: ${(props) => props.theme.colors.orange01};
  text-align: center;
  line-height: 355px;
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
