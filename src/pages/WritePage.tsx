import axios, {AxiosResponse} from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {date} from 'yup';
import {auth} from '../firebase/Firebase';
import {postType, userType} from '../types';
const WritePage = () => {
  const uid = auth.currentUser?.uid;
  const nickName = auth.currentUser?.displayName;
  const {id} = useParams();
  const navigate = useNavigate();
  console.log('paramId: ', auth.currentUser);

  const mutation = useMutation((newPost: postType) => {
    return axios
      .post('http://localhost:4001/posts', newPost)
      .then((response: AxiosResponse) => {
        return response;
      });
  });

  const {data} = useQuery('users', async () => {
    const response = await axios.get('http://localhost:4001/posts');
    return response.data;
  });
  console.log('data: ', data);

  const [post, setPost] = useState<postType>({
    id,
    title: '',
    nickName,
    uid,
    content: '',
    price: undefined,
    matchingUsers: [],
    matchingUser: '',
    isMatching: false,
    isResolve: false,
    date: Date.now(),
  });

  const {title, content, price} = post;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setPost({
      ...post,
      [name]: value,
    });
  };
  console.log('post: ', post);

  // const getUsers = async () => {
  //   const response = await axios.get('http://localhost:4000/users');
  //   return response.data;
  // };
  //   const YourComponent = () => {
  //     const { data, error, status } = useQuery('users', getUsers);
  //     const filteredUser = data.users.find((user: userType) => user.id === uid);
  //     console.log('filterdUser: ', filteredUser);

  //     if (status === 'loading') {
  //       return <div>Loading...</div>;
  //     }
  //     if (error) {
  //       console.log(error)

  //     }

  //   }

  const onSubmitHandler = () => {
    mutation.mutate(post);
    navigate('/home');
  };
  return (
    <>
      <form action='' onSubmit={onSubmitHandler}>
        제목
        <input type='text' name='title' value={title} onChange={onChange} />
        내용
        <input type='text' name='content' value={content} onChange={onChange} />
        가격{' '}
        <input type='text' name='price' value={price} onChange={onChange} />
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
