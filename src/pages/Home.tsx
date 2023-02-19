import { useNavigate } from 'react-router';
import { postType } from '../types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { data } = useQuery(['users'], async () => {
    const response = await axios.get('http://localhost:4000/posts');
    return response.data;
  });
  console.log('data: ', data);

  return (
    <div>
      <div>
        <h2>글목록</h2>
        {data &&
          data.map((item: postType) => {
            return (
              <div style={{ display: 'flex', gap: '10px' }} key={item.id}>
                <ul
                  style={{ border: '1px solid #000000' }}
                  onClick={() =>
                    navigate(`/detail/${item.category}/${item.id}`)
                  }
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
