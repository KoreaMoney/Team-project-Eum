import {signOut} from 'firebase/auth';
import {useNavigate} from 'react-router';
import {auth} from '../firebase/Firebase';
import {v4 as uuidv4} from 'uuid';
import {useQuery} from 'react-query';
import axios from 'axios';
import {postType} from '../types';
const Home = () => {
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;
  const id = uuidv4();
  const {data} = useQuery('users', async () => {
    const response = await axios.get('http://localhost:4001/posts');
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
        <h2>글목록</h2>
        {data && data.map((item: postType) => {
          return (
            <div style={{display: 'flex', gap: '10px'}} key={item.id}>
              <ul
                style={{border: '1px solid #000000'}}
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
