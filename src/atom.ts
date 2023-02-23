import { User } from 'firebase/auth';
import { atom } from 'recoil';
/**여기에서 default는 기본값이 필요하기 때문에 사용됩니다
 * 다크모드 임시적으로 recoil setting을 위해 넣었습니다
 */
// export const isDarkAtom = atom({
//   key: 'isDark',
//   default: true,
// });

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
