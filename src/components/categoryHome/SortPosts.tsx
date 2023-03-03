import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { sortAtom } from '../../atom';
import * as a from '../../styles/styledComponent/category';
const SortPosts = ({
  onSortClick,
}: {
  onSortClick: (sortValue: string) => void;
}) => {
  const [isDrop, setIsDrop] = useState(false);
  console.log('isDrop: ', isDrop);
  const [sort, setSort] = useRecoilState(sortAtom);

  return (
    <a.DropDownContainer>
      <a.SortBarContainer onClick={() => setIsDrop(!isDrop)}>
        <a.SortBar>{sort}</a.SortBar>
        <a.DropDownIcon />
        {isDrop && (
          <a.DropDownBox>
            <a.DropDownButton onClick={() => onSortClick('최신순')}>
              최신순
            </a.DropDownButton>
            <a.DropDownButton onClick={() => onSortClick('추천순')}>
              추천순
            </a.DropDownButton>
          </a.DropDownBox>
        )}
      </a.SortBarContainer>
    </a.DropDownContainer>
  );
};

export default SortPosts;
