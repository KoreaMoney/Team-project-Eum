import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAnimation, motion } from 'framer-motion';
import { theme } from '../../styles/theme';

/**순서
 * 1. 검색 데이터 변경넣기
 * 2. 선택 데이터 변경하기
 */
const SearchInput = () => {
  const [searchText, setSearchText] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const { categoryName } = useParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimation = useAnimation();

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  const onSubmitSearchPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // select가 지정되어있으면 아래 주소로, 그렇지 않다면 검색되지 않게 함
    if (selectValue) {
      categoryName
        ? navigate(`/search/${categoryName}/${selectValue}/${searchText}`)
        : navigate(`/search/all/${selectValue}/${searchText}`);
      setSearchText('');
      setSelectValue('');
    } else return;
  };

  return (
    <SearchContainer>
      <form onSubmit={onSubmitSearchPost} aria-label="검색창">
        <Search>
          <motion.svg
            onClick={toggleSearch}
            transition={{ type: 'linear' }}
            animate={{ x: searchOpen ? 140 : 315 }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <SearchWrapper>
            <SelectWrapper>
              <Select
                value={selectValue}
                onChange={onChangeSelect}
                animate={inputAnimation}
                transition={{ type: 'linear' }}
                initial={{ scaleX: 0 }}
              >
                <option value="" aria-label="선택">
                  선택
                </option>
                <option value="title" aria-label="제목">
                  제목
                </option>
                <option value="content" aria-label="내용">
                  내용
                </option>
                <option value="nickName" aria-label="작성자">
                  작성자
                </option>
              </Select>
            </SelectWrapper>
            <Input
              type="text"
              onChange={onChangeSearchInput}
              value={searchText}
              animate={inputAnimation}
              transition={{ type: 'linear' }}
              initial={{ scaleX: 0 }}
              placeholder="검색어를 입력해주세요"
            />
          </SearchWrapper>
        </Search>
      </form>
    </SearchContainer>
  );
};

export default SearchInput;

const SearchContainer = styled.div`
  margin-left: 23px;
`;
const Search = styled.span`
  color: ${theme.colors.black};
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  svg {
    height: 30px;
  }
`;
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  height: 40px;
`;

const SelectWrapper = styled.div`
  margin-right: 20px;
`;
const Select = styled(motion.select)`
  transform-origin: right center;
  background-color: transparent;
  border: none;
  outline: none;
  height: 40px;
  font-size: ${theme.fontSize.title18};
  option {
    font-size: ${theme.fontSize.title20};
  }
`;
const Input = styled(motion.input)`
  transform-origin: right center;
  background-color: transparent;
  padding-left: 40px;
  width: 245px;
  height: 40px;
  border: 2px solid ${theme.colors.black};
  border-radius: 23px;
  outline: none;
  font-size: ${theme.fontSize.title16};
`;
