import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, storageService } from '../firebase/Firebase';
import { postType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import parse from 'html-react-parser';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';
const WritePage = () => {
  const navigate = useNavigate();
  auth.onAuthStateChanged((user) => {
    if (!user) navigate(-1);
  });
  const imgRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentsRef = useRef<ReactQuill>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
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
  const sellerUid = auth.currentUser?.uid;
  const nickName = auth.currentUser?.displayName;
  const { id } = useParams();

  const { mutate, isError, isLoading } = useMutation(
    (newPost: postType) => axios.post('http://localhost:4000/posts', newPost),
    {
      onSuccess: () => {
        navigate(`/detail/${post.category}/${post.id}`);
      },
    }
  );

  // jsx문법에서 받아온 post를 useMutation의 인자에 보낸다. 그리고 axios를 통해 post한다.
  // post() 괄호 안에는 어디로 보낼것인가를 지정해주는 곳인 것 같다.
  // http://localhost:4000/posts 해당 api주소에 newPost를 추가한다는 코드
  const [post, setPost] = useState<postType>({
    id: uuidv4(),
    title: '',
    nickName,
    sellerUid,
    content: '',
    price: '',
    imgURL: '',
    category: '',
    like: [],
    views: 0,
    createAt: Date.now(),
  });
  // post의 key값으로 input value를 보내기 위해 구조분해 할당 한다.

  const { title, content, price, imgURL, category } = post;

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
      setPost({ ...post, imgURL: downloadUrl });
    }
  };

  // 한번에 value를 저장해주기 위해..
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const onChangePricec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    setPost({
      ...post,
      price: value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    });
  };
  // 카테고리는 select를 사용해 value를 전달해주기 때문에 함수를 따로 만들어줬다. 더 간편한 방법이 있을까??
  const onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPost({
      ...post,
      category: e.target.value,
    });
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
    const newPost: postType = {
      ...post,
      price: price.replace(/[^0-9]/g, ''),
    };
    await mutate(newPost); // 비동기 처리를 하는 함수라서 await을 꼭 붙혀줘야 한다.
    // await을 안붙히면 이 mutate 함수가 post를 전달해주러 갔다가 언제 돌아올지 모른다.
    // 안붙혀줬더니 간헐적으로 데이터를 못받아 오는 상황이 생겼었다.
  };

  // 서버통신은 다 비동기함수
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
            value={title}
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
            value={price}
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
            value={content}
            onChange={(value) => {
              setPost({ ...post, content: value });
            }}
          />
        </QuilWrapper>
        <button>작성완료</button>
      </Container>
    </>
  );
};
export default WritePage;
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
