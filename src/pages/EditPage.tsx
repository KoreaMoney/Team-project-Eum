import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editPostType } from '../types';
import { auth, storageService } from '../firebase/Firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const imgRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentsRef = useRef<ReactQuill>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const [imgURL, setImgURL] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  /**순서
   * 1. query를 먼저 지정
   * 2. 상단에 위치한 툴바 생성
   * 3. 툴바내 있는 사진 저장 눌렀을 시 사진 저장
   * 4. firebase storage에 저장
   * 5. react-quill사용하여 textArea진행
   * 6. 작성에 대한 유효성 검사
   */

  //React-query (Query)
  const { data: postdata, isLoading } = useQuery(
    ['editPost', id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/posts?id=${id}`
      );
      return response.data;
    },
    {
      select: (data) => {
        return data[0];
      },
    }
  );

  //React-query (Mutation)
  const { mutate } = useMutation(
    (editPost: editPostType) =>
      axios.patch(`${process.env.REACT_APP_JSON}/posts/${id}`, editPost),
    {
      onSuccess: () => {
        navigate(`/detail/${category}/${id}`);
      },
    }
  );

  //툴바 영역
  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    [{ align: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }],
    ['video'],
  ];

  // 옵션에 상응하는 포맷, 추가해주지 않으면 text editor에 적용된 스타일을 볼수 없음
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'bullet',
    'indent',
    'color',
    'video',
    'width',
  ];

  const modules = {
    toolbar: {
      container: toolbarOptions,
    },
  };

  //이미지 저장
  const saveImgFile = () => {
    if (imgRef.current?.files) {
      const file = imgRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const resultImg = reader.result;
        shortenUrl(resultImg as string);
      };
    }
  };

  // 파이어 스토리지를 이용해 base64 기반 이미지 코드를 짧은 url로 변경
  const shortenUrl = async (img: string) => {
    const imgRef = ref(storageService, `${auth.currentUser?.uid}${Date.now()}`);
    const imgDataUrl = img;
    let downloadUrl;
    if (imgDataUrl) {
      const response = await uploadString(imgRef, imgDataUrl, 'data_url');
      downloadUrl = await getDownloadURL(response.ref);
      setImgURL(downloadUrl);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
  };

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    setPrice(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  };

  // 카테고리는 select를 사용해 value를 전달해주기 때문에 함수를 따로 만들어줬다. 더 간편한 방법이 있을까??
  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  // React-quill 웹 에디터의 value는 html태그를 포함하고 있기에 유효성 검사를 위해 태그를 제거한다.
  const parsingHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // 유효성 검사
  const validation = () => {
    if (!category) {
      customInfoAlert('카테고리를 선택해주세요');
      categoryRef.current?.focus();
      return true;
    }
    if (!title.trim()) {
      customWarningAlert('제목을 입력해주세요');
      titleRef.current?.focus();
      return true;
    }
    if (!price.trim()) {
      customWarningAlert('가격을 입력해주세요');
      priceRef.current?.focus();
      return true;
    }
    if (!parsingHtml(content).trim()) {
      customWarningAlert('내용을 입력해주세요');
      contentsRef.current?.focus();
      return true;
    }
  };

  /**비동기 처리를 하는 함수라서 await을 꼭 붙혀줘야 한다.
   * await을 안붙히면 이 mutate 함수가 post를 전달해주러 갔다가 언제 돌아올지 모른다.
   * 안붙혀줬더니 간헐적으로 데이터를 못받아 오는 상황이 생겼었다.
   */
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation()) {
      return;
    }
    const post = {
      title,
      price: Number(price.replace(/[^0-9]/g, '')),
      imgURL,
      category,
      content,
    };
    await mutate(post);
  };

  useEffect(() => {
    setImgURL(postdata?.imgURL);
    setTitle(postdata?.title);
    setContent(postdata?.content);
    setCategory(postdata?.category);
    setPrice(postdata?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }, [postdata]);

  if (isLoading) return <div>Now Loading...</div>;

  return (
    <Container>
      <BorderBox>
        <FormWrapper onSubmit={onSubmitHandler}>
          <InputWrap>
            <TitleCategoryWrap>
              <SelectCategory
                value={category || ''}
                name="pets"
                id="pet-select"
                onChange={onChangeCategory}
                ref={categoryRef}
              >
                <option value="">--선택--</option>
                <option value="play">놀이</option>
                <option value="study">공부</option>
                <option value="advice">상담</option>
                <option value="etc">기타</option>
              </SelectCategory>
              <TitleInput
                ref={titleRef}
                type="text"
                name="title"
                value={title || ''}
                onChange={onChange}
                placeholder="제목"
                maxLength={16}
              />
            </TitleCategoryWrap>
            <div>
              <PriceInput
                ref={priceRef}
                onKeyDown={(e) =>
                  ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
                }
                type="text"
                name="price"
                value={price || ''}
                onChange={onChangePrice}
                placeholder="가격"
                maxLength={11}
                min={0}
              />
              원
            </div>
          </InputWrap>
          <QuillWrapper>
            <ReactQuill
              theme="snow"
              ref={contentsRef}
              modules={modules}
              formats={formats}
              value={content || ''}
              onChange={(value) => {
                setContent(value);
              }}
            />
          </QuillWrapper>
          <Button>
            <button>작성완료</button>
          </Button>
        </FormWrapper>

        <ImageContainer>
          <ImageWrapper>
            <ImgBox img={imgURL} />
            <ImageSelectButton>
              <ImageLabel htmlFor="changeImg">파일선택</ImageLabel>
            </ImageSelectButton>
            <input
              hidden
              id="changeImg"
              type="file"
              placeholder="파일선택"
              onChange={saveImgFile}
              ref={imgRef}
            />
          </ImageWrapper>
        </ImageContainer>
      </BorderBox>
    </Container>
  );
};

export default EditPage;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
`;
const BorderBox = styled.div`
  width: 70%;
  margin: 5px auto;
`;
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-color: ${(props) => props.theme.colors.black};
`;
const InputWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3em;
  width: 70%;
`;
const TitleCategoryWrap = styled.div`
  display: flex;
  align-items: center;
  height: 1.5rem;
`;
const SelectCategory = styled.select`
  height: 100%;
`;
const TitleInput = styled.input`
  height: 100%;
`;
const PriceInput = styled.input`
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
`;

const QuillWrapper = styled.div`
  width: 70%;
  .ql-container {
    width: 100%;
    height: 25rem;
  }
`;

const Button = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  height: 2em;
  width: 70%;
  button {
    background-color: ${(props) => props.theme.colors.brandColor};
    border: none;
    width: 15%;
    height: 1.5rem;
    &:hover {
      border: 2px solid ${(props) => props.theme.colors.button};
    }
  }
`;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 0 auto;
  width: 70%;
`;
const ImgBox = styled.div<{ img: string }>`
  width: 25%;
  height: 13rem;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
`;
const ImageLabel = styled.label`
  cursor: pointer;
`;

const ImageSelectButton = styled.button`
  background-color: ${(props) => props.theme.colors.brandColor};
  border: none;
  width: 15%;
  height: 1.5rem;
  &:hover {
    border: 2px solid ${(props) => props.theme.colors.button};
  }
`;
