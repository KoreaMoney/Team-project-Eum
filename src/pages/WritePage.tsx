import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../firebase/Firebase';
import { postType } from '../types';
import { v4 as uuidv4 } from 'uuid';

const WritePage = () => {
  const sellerUid = auth.currentUser?.uid;
  const nickName = auth.currentUser?.displayName;
  const { id } = useParams();
  const navigate = useNavigate();
  console.log('paramId: ', auth.currentUser);

  const { mutate, isError, isLoading } = useMutation((newPost: postType) =>
    axios.post('http://localhost:4000/posts', newPost)
  );
  // jsx문법에서 받아온 post를 useMutation의 인자에 보낸다. 그리고 axios를 통해 post한다.
  // post() 괄호 안에는 어디로 보낼것인가를 지정해주는 곳인 것 같다.
  // http://localhost:4000/posts 해당 api주소에 newPost를 추가한다는 코드

  const [post, setPost] = useState<postType>({
    id: uuidv4(),
    title: '',
    nickName,
    sellerUid,
    content: '',
    price: '',
    imgURL: [],
    category: '',
    like: [],
    views: 0,
    createAt: Date.now(),
  });


  // post의 key값으로 input value를 보내기 위해 구조분해 할당 한다.
  const { title, content, price } = post;
  // 한번에 value를 저장해주기 위해..
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPost({
      ...post,
      [name]: value,
    });
  };
  // 카테고리는 select를 사용해 value를 전달해주기 때문에 함수를 따로 만들어줬다. 더 간편한 방법이 있을까??
  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPost({
      ...post,
      category: e.target.value,
    });
  };

  const onSubmitHandler = async () => {
    await mutate(post); // 비동기 처리를 하는 함수라서 await을 꼭 붙혀줘야 한다.
    // await을 안붙히면 이 mutate 함수가 post를 전달해주러 갔다가 언제 돌아올지 모른다.
    // 안붙혀줬더니 간헐적으로 데이터를 못받아 오는 상황이 생겼었다. 
    navigate(`/categorypage/${post.category}/${post.id}`);
  };
  // 서버통신은 다 비동기함수

  return (
    <>
      <form action="" onSubmit={onSubmitHandler}>
        제목
        <input type="text" name="title" value={title} onChange={onChange} />
        내용
        <input type="text" name="content" value={content} onChange={onChange} />
        가격{' '}
        <input type="text" name="price" value={price} onChange={onChange} />
        <select name="pets" id="pet-select" onChange={onChangeCategory}>
          <option value="">--선택--</option>
          <option value="play">놀이</option>
          <option value="study">공부</option>
          <option value="advice">상담</option>
          <option value="etc">기타</option>
        </select>
        <div>
          매칭된사람
          <ul>
            <li>
              - 닉네임
              <button>매칭하기</button>
            </li>
          </ul>
          <button>글 등록</button>
        </div>
      </form>
    </>
  );
};
export default WritePage;
