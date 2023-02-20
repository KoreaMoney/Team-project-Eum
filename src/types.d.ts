export interface ISignUpForm {
  email: string;
  pw: string;
  checkPw: string;
}

export interface userType {
  id: string | undefined;
  nickName: string | null | undefined;
  profileImg: string | null | undefined;
  point: string;
  contactTime: string;
  like: [];
  isDoneCount: number;
}

export interface postType {
  id: string | undefined;
  title: string;
  nickName: string | null | undefined;
  sellerUid: string | undefined;
  content: string;
  price: string;
  imgURL: [];
  category: string;
  like: [];
  views: number;
  createAt: number;
}

export interface commentType {
  id: string;
  postId: string | undefined;
  writer: string | null | undefined;
  content: string;
  createAt: number;
  writerNickName: string | null | undefined;
  isEdit: boolean;
}

export interface onSalePostType {
  id: string;
  postsId: string | undefined;
  buyerUid: string | null | undefined;
  sellerUid: string | null | undefined;
  title: string;
  content: string;
  imgURL: [];
  like: [];
  views: number;
  price: string;
  category: string;
  ceatedAt: number;
  isDone: boolean;
  isSellerCancel: boolean;
  isBuyerCancel: boolean;
}

export interface LocationState {
  from: Location;
}
/**삭제하지 말아주세요 */

// import 'styled-components';
// declare module 'styled-components' {
//   export interface DefaultTheme {
//     bgColor: string;
//     textColor: string;
//     accentColor: string;
//   }
// }
