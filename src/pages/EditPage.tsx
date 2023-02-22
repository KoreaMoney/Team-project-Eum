import parse from 'html-react-parser';
import styled from 'styled-components';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editPostType } from '../types';
import { auth, storageService } from '../firebase/Firebase';
import ReactQuill from 'react-quill';
import axios from 'axios';
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

  const { data: postdata, isLoading } = useQuery(
    ['editPost', id],
    async () => {
      const response = await axios.get(`http://localhost:4000/posts?id=${id}`);
      return response.data;
    },
    {
      select: (data) => {
        return data[0];
      },
    }
  );
  const {
    mutate,
    isError,
    isLoading: patchLoading,
  } = useMutation(
    (editPost: editPostType) =>
      axios.patch(`http://localhost:4000/posts/${id}`, editPost),
    {
      onSuccess: () => {
        navigate(`/detail/${category}/${id}`);
      },
    }
  );
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
        shrotenUrl(resultImg as string);
      };
    }
  };

  // 파이어 스토리지를 이용해 base64 기반 이미지 코드를 짧은 url로 변경
  const shrotenUrl = async (img: string) => {
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

  const onChangePricec = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation()) {
      return;
    }
    const post = {
      title,
      price: price.replace(/[^0-9]/g, ''),
      imgURL,
      category,
      content,
    };
    await mutate(post); // 비동기 처리를 하는 함수라서 await을 꼭 붙혀줘야 한다.
    // await을 안붙히면 이 mutate 함수가 post를 전달해주러 갔다가 언제 돌아올지 모른다.
    // 안붙혀줬더니 간헐적으로 데이터를 못받아 오는 상황이 생겼었다.
  };

  useEffect(() => {
    setImgURL(postdata?.imgURL);
    setTitle(postdata?.title);
    setContent(postdata?.content);
    setCategory(postdata?.category);
    setPrice(postdata?.price.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }, [postdata]);

  if (isLoading) return <div> </div>;

  return (
    <>
      <ImageContainer>
        <ImageWrapper img={imgURL}></ImageWrapper>
        <button>
          <ImageLabel htmlFor="changeimg">파일선택</ImageLabel>
        </button>
        <input
          hidden
          id="changeimg"
          type="file"
          placeholder="파일선택"
          onChange={saveImgFile}
          ref={imgRef}
        />
      </ImageContainer>
      <Container onSubmit={onSubmitHandler}>
        <TitleCategoryWrap>
          <select
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
          </select>
          <input
            ref={titleRef}
            type="text"
            name="title"
            value={title || ''}
            onChange={onChange}
            placeholder="제목"
            maxLength={16}
          />
          <PriceInput
            ref={priceRef}
            onKeyDown={(e) =>
              ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
            }
            type="text"
            name="price"
            value={price || ''}
            onChange={onChangePricec}
            placeholder="가격"
            maxLength={11}
            min={0}
          />
        </TitleCategoryWrap>
        <QuilWrapper>
          <ReactQuill
            ref={contentsRef}
            theme="snow"
            modules={modules}
            formats={formats}
            value={content || ''}
            onChange={(value) => {
              setContent(value);
            }}
          />
        </QuilWrapper>
        <button>작성완료</button>
      </Container>
    </>
  );
};

export default EditPage;
const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 25.7rem;
  margin: 0 auto;
`;
const TitleCategoryWrap = styled.div`
  display: flex;
  flex-direction: row;
`;
const PriceInput = styled.input`
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const QuilWrapper = styled.div`
  .ql-container {
    width: 40rem;
    height: 25rem;
  }
`;
const ImageWrapper = styled.div<{ img: string }>`
  width: 25rem;
  height: 25rem;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
`;
const ImageLabel = styled.label`
  cursor: pointer;
  padding: 20px;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
