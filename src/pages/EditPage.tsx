import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editPostType } from '../types';
import { auth, storageService } from '../firebase/Firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import {
  customInfoAlert,
  customWarningAlert,
} from '../components/modal/CustomAlert';
import * as a from '../styles/styledComponent/writeEdit';
import { getPostsId, getUsers, patchPosts } from '../api';
import Loader from '../components/etc/Loader';

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const imgRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentsRef = useRef<ReactQuill>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const queryClient = useQueryClient();
  const [imgURL, setImgURL] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
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
    () => getPostsId(id),
    {
      select: (data) => {
        return data[0];
      },
    }
  );

  // 글 수정할 때 만약 유저의 정보도 변경되었따면 함께 변경될 수 있도록 user의 정보를 불러옵니다.
  const { data: userData } = useQuery(['user', saveUser.uid], () =>
    getUsers(saveUser.uid)
  );

  //React-query (Mutation)
  const { mutate } = useMutation(
    (editPost: editPostType) => patchPosts(id, editPost),
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

     setPrice(Number(value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')));
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
      price: Number(price.toString().replace(/[^0-9]/g, '')),
      imgURL,
      category,
      content,
      profileImg: userData?.profileImg,
      nickName: userData?.nickName,
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

  /**사진삭제 */
const deleteImg = () => {
  setImgURL('');
};
  return (
    <a.WriteContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <a.MainTitle>수정하기</a.MainTitle>
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
                  maxLength={16}
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
                    value={content || ''}
                    onChange={(value) => {
                      setContent(value);
                    }}
                  />
                </a.WriteQuill>
              </a.EachContainer>
              <a.SubmitButton>수정 완료</a.SubmitButton>
            </a.ContentsContainer>
          </a.WriteForm>
        </>
      )}
    </a.WriteContainer>
  );
};

export default EditPage;
