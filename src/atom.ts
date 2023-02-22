import { User } from 'firebase/auth';
import { atom, selector } from 'recoil';
/**여기에서 default는 기본값이 필요하기 때문에 사용됩니다
 * 다크모드 임시적으로 recoil setting을 위해 넣었습니다
 */
export const isDarkAtom = atom({
  key: 'isDark',
  default: true,
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

// /**상단 카테고리 */
// export enum Categories {
//   'All' = 'All',
//   'Work' = 'Work',
//   'Private' = 'Private',
// }

// export interface IToDo {
//   text: string;
//   id: number;
//   category: Categories;
// }

// export const categoryState = atom<Categories>({
//   key: 'category',
//   default: Categories.All,
// });

// export const toDoState = atom<IToDo[]>({
//   key: 'toDo',
//   default: [],
// });

/**todo의 모든 데이터는 get됩니다
 * 카테고리 별 데이터를 get됩니다
 * 카테고리 별 동일한 것만 배열로 filter합니다
 */
// export const toDoSelector = selector({
//   key: 'toDoSelector',
//   get: ({ get }) => {
//     const toDos = get(toDoState);
//     const category = get(categoryState);
//     return toDos.filter((toDo) => toDo.category === category);
//   },
// });
