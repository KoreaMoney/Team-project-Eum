import styled from 'styled-components';
import camera from '../camera.png';
import deleteBt from '../deleteBt.png';
import { theme } from '../theme';
//WritePage 스타일
export const WriteContainer = styled.div`
  width: 792px;
  margin: 0 auto;
  margin-top: 88px;
`;

export const MainTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  line-height: ${(props) => props.theme.lineHeight.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.black};
  text-align: center;
  margin-bottom: 48px;
`;

export const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

export const EachContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  line-height: ${(props) => props.theme.lineHeight.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray50};
`;
export const PhotosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
export const AddPhotoBox = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  cursor: pointer;
`;

export const ImgBox = styled.div<{ img: string }>`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
  position: relative;
`;

export const PhotoIcon = styled.div`
  background-image: url(${camera});
  width: 32px;
  height: 32px;
  background-size: cover;
  background-position: center center;
`;

export const PhotoText = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  line-height: ${(props) => props.theme.lineHeight.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  color: ${(props) => props.theme.colors.gray20};
`;

export const DeleteIcon = styled.div`
  position: absolute;
  right: -12px;
  top: -12px;
  width: 24px;
  height: 24px;
  background-size: cover;
  background-position: center center;
  background-image: url(${deleteBt});
  cursor: pointer;
`;

export const TextInput = styled.input`
  width: 100%;
  height: 62px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  padding: 16px 40px;
  font-size: ${(props) => props.theme.fontSize.title20};
  line-height: ${(props) => props.theme.lineHeight.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border-radius: 10px;
  &::placeholder {
    color: ${(props) => props.theme.colors.gray20};
  }
  &:focus {
    outline: none;
  }
`;

export const CategorysContainer = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
`;

export const CategoryButton = styled.button<{ selected?: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${(props) =>
    props.selected
      ? props.theme.colors.orange02Main
      : props.theme.colors.white};
  color: ${(props) =>
    props.selected ? props.theme.colors.white : props.theme.colors.gray20};
  border: none;
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.title20};
  line-height: ${(props) => props.theme.lineHeight.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  cursor: pointer;
`;
export const WriteWrapper = styled.div`
  width: 70%;
  margin: 5px auto;
`;
export const WriteForm = styled.form``;

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
  width: 100%;
  .ql-toolbar {
    border: 1px solid ${(props) => props.theme.colors.gray20};
    border-radius: 10px 10px 0 0;
  }
  .ql-container {
    border: 1px solid ${(props) => props.theme.colors.gray20};
    border-radius: 0 0 10px 10px;
    min-height: 192px;
    font-size: ${theme.fontSize.title18};
  }
  .ql-editor {
    min-height: 192px;
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

export const SubmitButton = styled.button`
  width: 383px;
  height: 64px;
  border: 1px solid ${(props) => props.theme.colors.orange02Main};
  border-radius: 10px;
  font-size: ${(props) => props.theme.fontSize.ad24};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.orange02Main};
  margin: 0 auto;
  margin-bottom: 240px;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.white};
  }
  &:active {
    color: ${(props) => props.theme.colors.orange02Main};
    background-color: ${(props) => props.theme.colors.white};
  }
`;
