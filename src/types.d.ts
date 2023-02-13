export interface ISignUpForm {
  email: string;
  pw: string;
  checkPw: string;
}
export interface userType {
  id: string | undefined;
  email: string;
  password: string;
  phoneNumber: string; //전화번호
  area: string; //지역(select option으로 ㅇㅇ시 / ㅇㅇ구 / ㅇㅇ동)
  nickName: string | null | undefined;
  photoURL: string | null | undefined;
  score: number; //평점
  follower: Array; // 나를 좋아요 누른 유저 uid <- length로만 나타냄
  follow: Array; // 내가 좋아요 한 유저 uid
  point: number;
  matchingItem: Array[{
    id: string; //매칭된 서비스의 문서id
    isMatching: boolean; // todos의 isMatching이랑 둘다 true여야 isResolve가 true로 변하고, isResolve가 true이면 완료,취소버튼 안보이고 완료 라는 문구가 글에 나오게끔 해야함
    isResolve: boolean; // 매칭된 문제가 해결됐는지
  }];
  comment: Array[{
    id: string;
    writer: string; // 댓글 작성자 uid
    content: string; //댓글내용
    date: string; //댓글 단 시간
  }];
}

export interface postType {
  id: string | undefined;
  title: string;
  nickName: string | null | undefined;
  uid: string | undefined;
  content: string;
  price: number | undefined;
  matchingUsers: [];
  matchingUser: string;
  isMatching: boolean;
  isResolve: boolean;
  date: number;
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
