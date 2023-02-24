import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import styled from 'styled-components';

/**순서
 * 1. 검색 데이터 변경넣기
 * 2. 선택 데이터 변경하기
 */
const SearchInput = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const { categoryName } = useParams();

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
    <div>
      <form onSubmit={onSubmitSearchPost} aria-label="검색창">
        <SearchWrapper>
          <select value={selectValue} onChange={onChangeSelect}>
            <option value="" aria-label="선택">선택</option>
            <option value="title" aria-label="제목">제목</option>
            <option value="content" aria-label="내용">내용</option>
            <option value="nickName" aria-label="작성자">작성자</option>
          </select>
          <button aria-label="찾기">
            <IoIosSearch size={20} />
          </button>
          <input
            type="text"
            onChange={onChangeSearchInput}
            value={searchText}
          />
        </SearchWrapper>
      </form>
    </div>
  );
};

export default SearchInput;

const SearchWrapper = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;

  select {
    border: none;
    outline: none;
    background-color: ${(props) => props.theme.colors.white};
    height: 2.5em;
    border-radius: 3px 0 0 3px;
  }

  button {
    border: none;
    outline: none;
    background-color: ${(props) => props.theme.colors.white};
    height: 2.5em;
  }

  input {
    border: none;
    outline: none;
    background-color: ${(props) => props.theme.colors.white};
    height: 2.5em;
    border-radius: 0 3px 3px 0;
    width: 150%;
  }
`;
