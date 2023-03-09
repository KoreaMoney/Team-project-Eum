import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from '../../styles/theme';
import styled from 'styled-components';
import { customWarningAlert } from '../modal/CustomAlert';
import { RxMagnifyingGlass } from 'react-icons/rx';

/**순서
 * 1. 검색 데이터 변경넣기
 * 2. 선택 데이터 변경하기
 */
const SearchInput = () => {
  const [searchText, setSearchText] = useState('');
  const [selectValue, setSelectValue] = useState('title');
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
    if (searchText) {
      categoryName
        ? navigate(`/search/${categoryName}/${selectValue}/${searchText}`)
        : navigate(`/search/all/${selectValue}/${searchText}`);
      setSearchText('');
    } else {
      customWarningAlert('검색정보를 찾을 수 없습니다.');
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitSearchPost} aria-label="검색창">
        <SearchWrapper>
          <SelectWrapper>
            <Select value={selectValue} onChange={onChangeSelect}>
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
          <InputBox>
            <RxMagnifyingGlass size={25} />
            <Input
              type="text"
              onChange={onChangeSearchInput}
              value={searchText}
              placeholder="검색어를 입력해주세요"
            />
          </InputBox>
        </SearchWrapper>
      </form>
    </div>
  );
};

export default SearchInput;

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
const Select = styled.select`
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

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 40px;
  border: 2px solid ${theme.colors.gray40};
  border-radius: 23px;
`;
const Input = styled.input`
  transform-origin: right center;
  background-color: transparent;
  outline: none;
  border: none;
  width: 200px;
  padding-left: 10px;
  color: ${theme.colors.black};
  font-size: ${theme.fontSize.title16};
`;
