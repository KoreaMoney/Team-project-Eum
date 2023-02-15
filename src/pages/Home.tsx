import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { auth } from '../firebase/Firebase';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { postType } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const id = uuidv4();
  const { data } = useQuery(['users'], async () => {
    const response = await axios.get('http://localhost:4000/posts');
    return response.data;
  });
  console.log('data: ', data);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/signin');
      })
      .catch((error) => {
        console.log('로그아웃error: ', error);
      });
  };
  console.log('auth.curr: ', auth.currentUser);

  return (
    <div>
      Home <button onClick={logOut}>로그아웃</button>
      <button
        onClick={() => {
          navigate(`/writepage/${id}`);
        }}
      >
        글쓰기
      </button>
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
      <div>
        <h2>글목록</h2>
        {data &&
          data.map((item: postType) => {
            return (
              <div style={{ display: 'flex', gap: '10px' }} key={item.id}>
                <ul
                  style={{ border: '1px solid #000000' }}
                  onClick={() => navigate(`/detail/${item.id}`)}
                >
                  <li>제목 :{item.title}</li>
                  <li>내용 :{item.content}</li>
                  <li>가격 :{item.price}</li>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default Home;
