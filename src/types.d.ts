export interface ISignUpForm {
  email: string;
  pw: string;
  checkPw: string;
  nickName: string;
}
export interface NavButtonProps {
  active?: boolean;
};
export interface ILoginForm {
  email: string;
  password: string;
}
export interface userType {
  id: string | undefined;
  nickName: string | null | undefined;
  profileImg: string | null | undefined;
  point: number;
  contactTime: string;
  like: [];
  isDoneCount: number;
  commentsCount: number;
}
export interface postType {
  id: string | undefined;
  title: string;
  nickName: string | null | undefined;
  sellerUid: string | undefined;
  content: string;
  price: number | string;
  imgURL: string;
  category: string;
  like: [];
  views: number;
  createAt: number;
  profileImg: string;
  tsCount: number; // 파생된 거래페이지 완료개수
  commentsCount: number; // 후기가 달리면 +1씩
}
export interface editPostType {
  title: string;
  content: string;
  price: number | string;
  imgURL: string;
  category: string;
  profileImg: string;
  nickName: string;
}
export interface commentType {
  id: string;
  postId: string | undefined;
  sellerUid: string | null | undefined;
  buyerUid: string | null | undefined;
  content: string;
  profileImg: string | null | undefined;
  createAt: number;
  writerNickName: string | null | undefined;
}

export interface onSalePostType {
  id: string | undefined;
  postsId: string | undefined;
  buyerUid: string | null | undefined;
  sellerUid: string | null | undefined;
  title: string;
  content: string;
  imgURL: [];
  price: number | string;
  category: string;
  createdAt: number;
  isDone: boolean;
  isSellerCancel: boolean;
  isBuyerCancel: boolean;
  isCancel: boolean;
  cancelTime: number;
  doneTime: number;
}
export interface LocationState {
  from: Location;
}

export interface CustomFetchNextPageOptions extends FetchNextPageOptions {
  _limit: number;
}
