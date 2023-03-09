import axios from 'axios';
import { postType, userType, onSalePostType, commentType } from './types';

/**posts CRUD API
 * 1. 전체 post를 출력한다
 * 2. 새로운 post를 추가한다
 * 3. 특정 post 정보를 수정한다
 * 4. 특정 post를 삭제한다
 */
export const getPosts = async () => {
  const response = await axios.get(`${process.env.REACT_APP_JSON}/posts`);
  return response.data;
};

export const getPostsId = async (id: string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/posts?id=${id}`
  );
  return response.data;
};

export const getLikePostsId = async (id: string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/posts?like_like=${id}`
  );
  return response.data;
};

export const postPosts = async (post: postType) => {
  const response = await axios.post(
    `${process.env.REACT_APP_JSON}/posts`,
    post
  );
  return response.data;
};

export const patchPosts = (id: string | undefined, newPosts: any) =>
  axios.patch(`${process.env.REACT_APP_JSON}/posts/${id}`, newPosts);

export const deletePosts = async (id: string|undefined) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_JSON}/posts/${id}`
  );
  return response.data;
};

/**판매자의 post의 글들을 가져옵니다. */
export const getSellerPosts = async (seller: string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/posts?sellerUid=${seller}`
  );
  return response.data;
};
/**users CRUD API
 * 1. 특정 user를 출력한다
 * 2. 새로운 user를 추가한다
 * 3. 특정 user 정보를 수정한다
 * 4. 특정 user를 삭제한다
 */
export const getUsers = async (id: string | undefined|null) => {
  const response = await axios.get(`${process.env.REACT_APP_JSON}/users/${id}`);
  return response.data;
};

export const getAuthUsers = async () => {
  const response = await axios.get(`${process.env.REACT_APP_JSON}/users`);
  return response.data;
};

export const postUsers = async (user: userType) => {
  const response = await axios.post(
    `${process.env.REACT_APP_JSON}/users`,
    user
  );
  return response.data;
};

export const patchUsers = async (id: string | undefined|null, user: any) => {
  return await axios.patch(`${process.env.REACT_APP_JSON}/users/${id}`, user);
};

export const deleteUsers = async (id: string | undefined) => {
  return await axios.delete(`${process.env.REACT_APP_JSON}/users/${id}`);
};

/**onSalePosts CRUD API
 * 1. 특정 onSalePosts를 출력한다
 * 2. 새로운 onSalePosts를 추가한다
 * 3. 특정 onSalePosts 정보를 수정한다
 */
export const getOnSalePost = async (id: string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/onSalePosts?id=${id}`
  );
  return response.data;
};

// 거래 목록
export const getOnSalePostBuyer = async (id: string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/onSalePosts?buyerUid=${id}`
  );
  return response.data;
};

export const getOnSalePostSeller = async (id: string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/onSalePosts?sellerUid=${id}`
  );
  return response.data;
};

export const postOnSalePost = async (newSalePosts: onSalePostType) => {
  const response = await axios.post(
    `${process.env.REACT_APP_JSON}/onSalePosts`,
    newSalePosts
  );
  return response.data;
};

export const patchOnSalePost = async (
  id: string | undefined,
  newSalePosts: any
) => {
  const response = await axios.patch(
    `${process.env.REACT_APP_JSON}/onSalePosts/${id}`,
    newSalePosts
  );
  return response.data;
};

export const deleteOnSalePost = async (id: string | undefined) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_JSON}/onSalePosts/${id}`
  );
  return response.data;
};

/**comments CRUD API
 * 1. 전체 comments를 출력한다
 * 2. 새로운 comments를 추가한다
 * 3. 특정 comments를 삭제한다
 */
export const getComments = async () => {
  const response = await axios.get(`${process.env.REACT_APP_JSON}/comments`);
  return response.data;
};

export const getUserComments = async (id:string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/comments?sellerUid=${id}`
  );
  return response.data;
};

export const postComments = async (newComment: commentType) => {
  const response = await axios.post(
    `${process.env.REACT_APP_JSON}/comments`,
    newComment
  );
  return response.data;
};

export const deleteComments = async (id: string | undefined) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_JSON}/comments/${id}`
  );
  return response.data;
};

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ etc ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//

export const getOnSalePosts = async () => {
  const response = await axios.get(`${process.env.REACT_APP_JSON}/onSalePosts`);
  return response.data;
};

export const getWriteMyComments = async (id: string | undefined) => {
  const response = await axios.get(
    `${process.env.REACT_APP_JSON}/comments?buyerUid=${id}`
  );
  return response.data;
};
