import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { auth, storageService } from '../firebase/Firebase';
import { postType } from '../types';
import { getUsers, postPosts } from '../api';
import * as a from '../styles/styledComponent/writeEdit';
import loadable from '@loadable/component';

const SignIn = loadable(() => import('./SignIn'));
const Loader = loadable(() => import('../components/etc/Loader'));

const WritePage = () => {
  const navigate = useNavigate();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const imgRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentsRef = useRef<ReactQuill>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState('');

  const toolbarOptions = [
    // [{ header: [1, 2, 3, false] }],
    [{ align: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }],
    ['video'],
  ];

  /** 옵션에 상응하는 포맷
   * 추가해주지 않으면 text editor에 적용된 스타일을 볼수 없음
   */
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

  // 글쓴이의 유저정보를 가지고옵니다.
  const { data: user, isLoading } = useQuery(['user', saveUser.uid], () =>
    getUsers(saveUser.uid)
  );

  const sellerUid = saveUser.uid;

  const { mutate } = useMutation((newPost: postType) => postPosts(newPost), {
    onSuccess: () => {
      setTimeout(() => {
        navigate(`/detail/${category}/${post.id}`);
      }, 500);
    },
  });

  /**순서
   * 1. jsx문법에서 받아온 post를 useMutation의 인자 보낸다
   * 2. axios를 통해 post한다
   * 3. post() 괄호 안에는 어디로 보낼것인가를 지정해준다
   * 4. http://localhost:4000/posts 해당 api주소에 newPost를 추가한다는 코드
   */
  const [post, setPost] = useState<postType>({
    id: uuidv4(),
    title: '',
    nickName: '',
    sellerUid,
    content: '',
    price: 0,
    imgURL: '',
    category: '',
    like: [],
    views: 0,
    createAt: Date.now(),
    profileImg: '',
    tsCount: 0,
    commentsCount: 0,
    isDone: false,
  });

  // post의 key값으로 input value를 보내기 위해 구조분해 할당 한다.
  const { title, content, price, imgURL } = post;

  // user정보가 있을 때에는 이렇게 저장됩니다.
  useEffect(() => {
    setPost((prevPost) => ({
      ...prevPost,
      nickName: user?.nickName || '',
      profileImg: user?.profileImg || '',
    }));
  }, [user]);

  //이미지 저장
  const saveImgFile = () => {
    if (!imgRef.current?.files || imgRef.current.files.length === 0) {
      return;
    }

    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const resultImg = reader.result;
      shortenUrl(resultImg as string);
    };
  };

  // 파이어 스토리지를 이용해 base64 기반 이미지 코드를 짧은 url로 변경
  const shortenUrl = async (img: string) => {
    const imgRef = ref(storageService, `${auth.currentUser?.uid}${Date.now()}`);
    const imgDataUrl = img;
    let downloadUrl;
    if (imgDataUrl) {
      const response = await uploadString(imgRef, imgDataUrl, 'data_url');
      downloadUrl = await getDownloadURL(response.ref);
      setPost({ ...post, imgURL: downloadUrl });
    }
  };

  // value 저장
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    setPost({
      ...post,
      price: value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    });
  };

  // React-quill 웹 에디터의 value -> html태그를 포함하고 있기에 유효성 검사를 위해 태그를 제거
  const parsingHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // 유효성 검사
  const validation = () => {
    if (!category) {
      customInfoAlert('카테고리를 선택해주세요');
      return true;
    }
    if (!title.trim()) {
      customWarningAlert('제목을 입력해주세요');
      titleRef.current?.focus();
      return true;
    }
    if (!price) {
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

  //비동기 처리를 하는 함수라서 await으로 진행
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation()) {
      return;
    }
    const newPost: postType = {
      ...post,
      category: category,
      price: Number(price.toString().replace(/[^0-9]/g, '')),
    };
    await mutate(newPost); //
  };

  // 서버통신은 다 비동기함수
  if (!saveUser) {
    return <SignIn />;
  }
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  const deleteImg = () => {
    setPost({ ...post, imgURL: '' });
  };

  return (
    <a.WriteContainer>
      <a.MainTitle>글쓰기</a.MainTitle>
      <a.WriteForm onSubmit={onSubmitHandler}>
        <a.ContentsContainer>
          <a.EachContainer>
            <a.Title>사진</a.Title>
            <a.PhotosContainer>
              <label htmlFor="changeImg">
                <a.AddPhotoBox>
                  <input
                    hidden
                    type="file"
                    id="changeImg"
                    onChange={saveImgFile}
                    ref={imgRef}
                    name="profile_img"
                    accept="image/*"
                  />
                  <a.PhotoIcon />
                </a.AddPhotoBox>
              </label>
              {imgURL && (
                <a.ImgBox img={imgURL}>
                  <a.DeleteIcon onClick={deleteImg} />
                </a.ImgBox>
              )}
            </a.PhotosContainer>
          </a.EachContainer>
          <a.EachContainer>
            <a.Title>제목/가격</a.Title>
            <a.TextInput
              ref={titleRef}
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="제목"
              maxLength={32}
            />
            <a.TextInput
              ref={priceRef}
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
              type="text"
              name="price"
              value={price === 0 ? '' : price}
              onChange={onChangePrice}
              placeholder="가격"
              maxLength={11}
              min={0}
            />
          </a.EachContainer>
          <a.EachContainer>
            <a.Title>카테고리</a.Title>
            <a.CategorysContainer>
              <a.CategoryButton
                aria-label="공부"
                onClick={() => setCategory('study')}
                selected={category === 'study'}
                type="button"
              >
                공부
              </a.CategoryButton>
              <a.CategoryButton
                aria-label="놀이"
                onClick={() => setCategory('play')}
                selected={category === 'play'}
                type="button"
              >
                놀이
              </a.CategoryButton>
              <a.CategoryButton
                aria-label="상담"
                onClick={() => setCategory('advice')}
                selected={category === 'advice'}
                type="button"
              >
                상담
              </a.CategoryButton>
              <a.CategoryButton
                aria-label="기타"
                onClick={() => setCategory('etc')}
                selected={category === 'etc'}
                type="button"
              >
                기타
              </a.CategoryButton>
            </a.CategorysContainer>
          </a.EachContainer>
          <a.EachContainer>
            <a.Title>설명</a.Title>
            <a.WriteQuill>
              <ReactQuill
                theme="snow"
                ref={contentsRef}
                modules={modules}
                formats={formats}
                value={content}
                onChange={(value) => {
                  setPost({ ...post, content: value });
                }}
              />
            </a.WriteQuill>
          </a.EachContainer>
          <a.SubmitButton>작성 완료</a.SubmitButton>
        </a.ContentsContainer>
      </a.WriteForm>
    </a.WriteContainer>
  );
};
export default WritePage;
