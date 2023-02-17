import axios from 'axios';
import { useEffect } from 'react';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { postType } from '../types';
import { Link } from 'react-router-dom';
import CommentInput from '../components/comment/CommentInput';
import CommentsList from '../components/comment/CommentsList';


const CategoryPageDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery(['post', id], async () => {
    // 쿼리키는 중복이 안되야 하기에 detail페이지는 저렇게 뒤에 id를 붙혀서 쿼리키를 다 다르게 만들어준다.
    const response = await axios.get(`http://localhost:4000/posts?id=${id}`);
    return response.data;
  });
  if (isLoading) {
    console.log('로딩중');
    return <div>Lodding...</div>;
  }
  if (!data || data.length === 0) {
    console.log('데이터없음');
    return <div>Mo data found</div>;
  }
  // 여기에서 isLoading이 없으면 로딩중일 때 에러가 나기때문에 loading중인 상태를 꼭 정의해주도록 한다.
  
  return (
    <>
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
      <p>제목:{data[0].title}</p>
      <p>내용:{data[0].content}</p>
      <p>가격:{data[0].price}</p>
      <p>카테고리:{data[0].category}</p>
      <p>닉네임:{data[0].nickName}</p>
      <p>조회수:{data[0].views}</p>
      <div>
        <CommentInput />
        <CommentsList />
      </div>
    </>
  );
};
export default CategoryPageDetail;
