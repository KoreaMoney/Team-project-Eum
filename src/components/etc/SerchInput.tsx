import React, {  useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
const SerchInput = () => {
  const [serchText, setSerchText] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const onChangeSerchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerchText(e.target.value);
  };
  console.log('serchText: ', serchText);

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };
  console.log('selectValue: ', selectValue);

  const onSubmitSerchPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // select가 지정되어있으면 아래 주소로, 그렇지 않다면 검색되지 않게 함
    if (selectValue) {
      navigate(`/search/${categoryName}/${selectValue}/${serchText}`);
      setSerchText('');
      setSelectValue('');
    } else return;
  };

  return (
    <div>
      <form onSubmit={onSubmitSerchPost}>
        <select value={selectValue} onChange={onChangeSelect}>
          <option value="">선택</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="nickName">작성자</option>
        </select>
        <input type="text" onChange={onChangeSerchInput} value={serchText} />
        <button>검색</button>
      </form>
    </div>
  );
};

export default SerchInput;
