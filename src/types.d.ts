export interface ISignUpForm {
  email: string;
  pw: string;
  checkPw: string;
}

export interface userType {
  id: string | undefined;
  nickName: string | null | undefined;
  profileImg: string | null | undefined;
  point: number|undefined;
  contactTime: string;
  like: [],
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
