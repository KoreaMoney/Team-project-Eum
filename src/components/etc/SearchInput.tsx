import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import styled from 'styled-components';

const SearchInput = () => {
  const [searchText, setSearchText] = useState('');
  const [selectValue, setSelectValue] = useState('');
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
      navigate(`/search/${categoryName}/${selectValue}/${searchText}`);
      setSearchText('');
      setSelectValue('');
    } else return;
  };

  return (
    <div>
      <form onSubmit={onSubmitSearchPost}>
        <SearchWrapper>
          <select value={selectValue} onChange={onChangeSelect}>
            <option value="">선택</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="nickName">작성자</option>
          </select>
          <button>
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
    background-color: #eeeeee;
    border: none;
    outline: none;
    height: 2.5em;
    border-radius: 10px 0 0 10px;
  }

  button {
    background-color: #eeeeee;
    border: none;
    outline: none;
    height: 2.5em;
  }

  input {
    border: none;
    outline: none;
    height: 2.5em;
    background-color: #eeeeee;
    border-radius: 0 10px 10px 0;
    width: 100%;
  }
`;
