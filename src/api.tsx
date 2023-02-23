import axios from 'axios';

// profile nickname 출력하기
export const getProfileNickName = async () => {
  return await axios.get(`https://orchid-sprinkle-snapdragon.glitch.me/users`);
};

// profile nickname 수정하기
export const updateProfileNickName = async (user: any) => {
  return await axios.patch(
    `https://orchid-sprinkle-snapdragon.glitch.me/users/${user.id}`,
    user
  );
};

// profile point 출력하기
export const getProfilePoint = async () => {
  return await axios.get(`https://orchid-sprinkle-snapdragon.glitch.me/users`);
};

// 거래내역 point 출력하기
export const getTradePoint = async () => {
  return await axios.get(
    `https://orchid-sprinkle-snapdragon.glitch.me/onSalePosts`
  );
};

// post 정보 출력하기
export const getPostList = async () => {
  return await axios.get(`https://orchid-sprinkle-snapdragon.glitch.me/posts`);
};
