import { User } from 'firebase/auth';
import { atom } from 'recoil';
/**여기에서 default는 기본값이 필요하기 때문에 사용됩니다
 * 다크모드 임시적으로 recoil setting을 위해 넣었습니다
 */
// export const isDarkAtom = atom({
//   key: 'isDark',
//   default: true,
// });
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
