import axios from 'axios';

// profile nickname 출력하기
export const getProfileNickName = async (user: any) => {
  const response = await axios.get(
    `https://orchid-sprinkle-snapdragon.glitch.me/users/${user.id}`
  );
  console.log( 'user.id: ' ,user.id);
  
  return response.data;
};

// profile nickname 수정하기
export const updateProfileNickName = async (user: any) => {
  return await axios.patch(
    `https://orchid-sprinkle-snapdragon.glitch.me/users/${user.id}`,
    user
  );
};

// profile point 출력하기

export const getProfilePoint = async (user: any) => {
  const response = await axios.get(
    `https://orchid-sprinkle-snapdragon.glitch.me/users`
  );
  return response.data;
};

// 거래내역 point 출력하기
export const getTradePoint = async () => {
  const response = await axios.get(
    `https://orchid-sprinkle-snapdragon.glitch.me/onSalePosts`
  );
  return response.data;
};

// post 정보 출력하기
export const getPostList = async () => {
  return await axios.get(`https://orchid-sprinkle-snapdragon.glitch.me/posts`);
};
