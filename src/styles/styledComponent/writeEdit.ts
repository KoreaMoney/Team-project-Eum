import styled from 'styled-components';

//WritePage 스타일
export const WriteContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
`;
export const WriteWrapper = styled.div`
  width: 70%;
  margin: 5px auto;
`;
export const WriteForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-color: ${(props) => props.theme.colors.black};
  div {
  }
`;

export const WriteInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3em;
  width: 70%;
  input {
    height: 1.5rem;
    outline: none;
    text-align: end;

    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const WriteCategory = styled.div`
  display: flex;
  align-items: center;
  height: 1.5rem;
  select,
  input {
    height: 100%;
  }
`;

export const WriteQuill = styled.div`
  width: 70%;
  .ql-container {
    width: 100%;
    height: 25rem;
    font-size: 16px;
  }
`;

export const Button = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  height: 2em;
  width: 70%;
  button {
    background-color: yellow;
    border: none;
    width: 15%;
    height: 1.5rem;
    &:hover {
      border: 2px solid tomato;
    }
  }
`;

export const WriteImgContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
export const WriteImgWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 70%;
`;
export const ImgBox = styled.div<{ img: string }>`
  width: 25%;
  height: 13rem;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
`;

export const WriteImgBtn = styled.button`
  background-color: yellow;
  border: none;
  width: 15%;
  height: 1.5rem;
  &:hover {
    border: 2px solid tomato;
  }

  label {
    cursor: pointer;
  }
`;
