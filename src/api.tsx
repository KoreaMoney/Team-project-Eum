import axios from 'axios';

// profile nickname 출력하기
export const getProfileNickName = async () => {
  return await axios.get(`http://localhost:4000/users`);
};

// profile nickname 수정하기
export const updateProfileNickName = async (user: any) => {
  return await axios.patch(`http://localhost:4000/users/${user.id}`, user);
};

// profile point 출력하기
export const getProfilePoint = async () => {
  return await axios.get(`http://localhost:4000/users`);
};

// 거래내역 point 출력하기
export const getTradePoint = async () => {
  return await axios.get(`http://localhost:4000/onSalePosts`);
};
