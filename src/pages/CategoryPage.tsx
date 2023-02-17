import { uuidv4 } from '@firebase/util';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { postType } from '../types';

// 전체, 놀이 등 카테고리를 클릭하면 이동되는 페이지입니다.
const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  console.log('categoryName: ', categoryName);

  const { data } = useQuery(['posts', categoryName ?? 'all'], async () => {
    //  useQuery를 사용해 queryKey posts로 데이터를 가져오는데,
    // categoryName이 없으면 categoryName은 all이다.
    const url =
      categoryName === 'all'
        ? 'http://localhost:4000/posts'
        : `http://localhost:4000/posts?category=${categoryName}`;
    // categoryName이 all이면 url은 http://localhost:4000/posts 이고
    //  all이 아니면 http://localhost:4000/posts?category=${categoryName} 이다.
    const response = await axios.get(url);
    //  get해올 url을 위에서 정의해서 가져와 response 변수에 담는다.
    return response.data;
    // response의 data속성을 리턴한다.
  });

  const queryClient = useQueryClient();
  // useQueryClient() : QueryClient 객체를 가져올 수 있는 함수, 
  // QueryClient: 캐시,쿼리관리,상태업데이트 등을 처리하는 핵심객체, 데이터 업데이트 후 ui를 갱신하거나 서버에 데이터를 새로 요청하고 업데이트된 데이터를 받아와 ui를 갱신하는 등의 작업을 할 수 있다고 함.
  const handlePostClick = async (post: postType) => {
    await axios.patch(`http://localhost:4000/posts/${post.id}`, {
      views: post.views + 1, // 글 클릭하면 조회수 1씩 늘리기!!
    });
    // 특정 데이터만을 업데이트 하고싶으면 위 방법을 통해 가능합니다.
    //  ${post.id} 라는건 http://localho1st:4000/posts 주소의 데이터에서 내가 받은 post.id와 동일한 객체를 찾아줍니다.
    queryClient.fetchQuery(['posts', categoryName ?? 'all']);
    // fetchQuery : useQueryClient를 사용하여 queryClient 객체를 가져오고, 해당 쿼리를 다시 가져와서 데이터를 다시 로드할 수 있도록 하는 메서드 라고 한다.
    // axios로 patch요청을 보낸 후 45번줄을 호출해서 post목록 쿼리를 다시 가져와서 최신의 데이터를 가져올 수 있다고 한다.
    navigate(`/detail/${post.category}/${post.id}`);
  };

  return (
    <PageContainer>
      <div>
        <ul style={{ display: 'flex', gap: '10px' }}>
          <Link to="/categorypage/all">
            <li>all</li>
          </Link>
          <Link to="/categorypage/study">
            <li>공부</li>
          </Link>
          <Link to="/categorypage/play">
            <li>놀이</li>
          </Link>
          <Link to="/categorypage/advice">
            <li>상담</li>
          </Link>
          <Link to="/categorypage/etc">
            <li>기타</li>
          </Link>
        </ul>
      </div>
      <NavContainer>
        <WriteButton
          onClick={() => {
            navigate('/writepage');
          }}
        >
          글쓰기
        </WriteButton>
      </NavContainer>
      <PostsContainer>
        {data &&
          data.map((item: postType) => {
            return (
              <PostContainer
                key={item.id}
                onClick={() => {
                  handlePostClick(item);
                }}
              >
                <p>제목 :{item.title}</p>
                <p>내용 :{item.content}</p>
                <p>가격 :{item.price}</p>
              </PostContainer>
            );
          })}
      </PostsContainer>
    </PageContainer>
  );
};

export default CategoryPage;
const PageContainer = styled.div`
  width: 90%;
  margin: 0 auto;
`;
const NavContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
`;
const WriteButton = styled.button`
  font-size: 1.5rem;
`;
const PostsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const PostContainer = styled.div`
  width: 40%;
  border: 1px solid black;
  margin-bottom: 1rem;
`;
