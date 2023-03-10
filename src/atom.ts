import { commentType, onSalePostType, postType } from './types.d';
import { User } from 'firebase/auth';
import { atom } from 'recoil';
import { userType } from './types';
/**여기에서 default는 기본값이 필요하기 때문에 사용됩니다
 * 다크모드 임시적으로 recoil setting을 위해 넣었습니다
 */
// export const isDarkAtom = atom({
//   key: 'isDark',
//   default: true,
// });
export const onSalePostAtom = atom<onSalePostType[] | null | undefined>({
  key: 'onSalePost',
  default: null,
});
export const myOnSalePostsAtom = atom<postType[] | null | undefined>({
  key: 'myOnSalePosts',
  default: [],
});
export const detailUserAtom = atom<userType | null | undefined>({
  key: 'detailUser',
  default: null,
});
export const detailPostAtom = atom<postType[] | null | undefined>({
  key: 'detailPost',
  default: null,
});
export const userCommentsAtom = atom<commentType[] | null | undefined>({
  key: 'userComments',
  default: null,
});
export const userPostsAtom = atom<postType[] | null | undefined>({
  key: 'userPosts',
  default: null,
});
export const userBadgeLengthAtom = atom({
  key: 'userBadgeLength',
  default: 0,
});
export const userProfileAtom = atom<userType | null | undefined>({
  key: 'userProfile',
  default: null,
});
export const viewModalAtom = atom({
  key: 'viewModal',
  default: false,
});
export const viewKakaoModalAtom = atom({
  key: 'viewKakaoModal',
  default: false,
});
export const viewBuyerModalAtom = atom({
  key: 'viewBuyerModal',
  default: false,
});
export const choiceBadgeAtom = atom({
  key: 'choiceBadge',
  default: '',
});
export const addKakaoAtom = atom({
  key: 'addKakaoId',
  default: '',
});

export const addBirthDateAtom = atom({
  key: 'addBirthDate',
  default: '',
});

export const addNickNameAtom = atom({
  key: 'addNickName',
  default: '•ㅤ중복검사를 눌러주세요.',
});

export const editNickNameAtom = atom({
  key: 'editNickName',
  default: false,
});

export const loginUserCheckState = atom<User | null>({
  key: 'loginUserCheck',
  default: null,
});

export const searchState = atom({
  key: 'searchState',
  default: {
    categoryName: 'all',
    select: 'title',
    word: '',
  },
});

export const isCancelAtom = atom({
  key: 'isCancelAtom',
  default: false,
});

export const isDoneAtom = atom({
  key: 'isDoneAtom',
  default: false,
});

export const sortAtom = atom({
  key: 'sortAtom',
  default: '최신순',
});
/**여기 아래에는 속도개선을 위해 custom을 components에서 recoil로 전환 */
