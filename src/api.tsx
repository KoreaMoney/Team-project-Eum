import axios from 'axios';

// profile nickname 출력하기
export const getProfileNickName = async (user: any) => {
  const response = await axios.get(`http://localhost:4000/users/${user.id}`);
  return response.data
};

// profile nickname 수정하기
export const updateProfileNickName = async (user: any) => {
  return await axios.patch(`http://localhost:4000/users/${user.id}`, user);
};

// profile point 출력하기
export const getProfilePoint = async (user: any) => {
  const response = await axios.get(`http://localhost:4000/users/${user.id}`);
  return response.data;
};

// 거래내역 point 출력하기
export const getTradePoint = async () => {
  const response = await axios.get(`http://localhost:4000/onSalePosts`);
  return response.data;
};

// post 정보 출력하기
export const getPostList = async () => {
  return await axios.get(`http://localhost:4000/posts`);
};
