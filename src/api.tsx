import axios from 'axios';

// profile img 출력하기
export const getProfileImg = async (id: any) => {
  return await axios.get(`http://localhost:4000/users?id=${id}`);
};

// profile img 수정하기
export const updateProfileImg = async (item: any) => {
  return await axios.patch(`http://localhost:4000/users/${item.id}`, item);
};
