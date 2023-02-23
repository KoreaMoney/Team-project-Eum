import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { auth, storageService } from '../../firebase/Firebase';
import { customSuccessAlert } from '../modal/CustomAlert';

export default function Profile(params: any) {
  const queryClient = useQueryClient();
  const imgRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const { data } = useQuery(['users'], () =>
    axios

      .get(`${process.env.REACT_APP_JSON}/users?id=${id}`)
      .then((res) => res.data)
  );
  console.log('id: ', id);
  console.log('data: ', data);
  const [photo, setPhoto] = useState(data?.[0]?.profileImg);

  const { mutate: editUser } = useMutation(
    (user: { id: string; profileImg: string }) =>
      axios.patch(`${process.env.REACT_APP_JSON}/users/${id}`, {
        profileImg: user.profileImg,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        customSuccessAlert('프로필 이미지를 수정하였습니다.');
      },
    }
  );

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

    const shrotenUrl = async (img: string) => {
      const imgRef = ref(
        storageService,
        `${auth.currentUser?.uid}${Date.now()}`
      );

      const imgDataUrl = img;
      let downloadUrl;
      if (imgDataUrl) {
        const response = await uploadString(imgRef, imgDataUrl, 'data_url');
        downloadUrl = await getDownloadURL(response.ref);
        setPhoto(downloadUrl);
        console.log('photo: ', photo);
        console.log('downloadUrl: ', downloadUrl);
      }
    };
  };
  console.log('photo: ', photo);
  const handleClick = async () => {
    await editUser({
      ...data,
      profileImg: photo,
    });
  };

  console.log('photo1: ', data?.[0]?.profileImg);
  return (
    <UserProfileImgContainer>
      <MyImageWrapper>
        <MyImage src={data?.[0]?.profileImg} alt="User Image" />
      </MyImageWrapper>
      <EditImgWrapper>
        <InputImgFile
          type="file"
          id="changeimg"
          onChange={saveImgFile}
          ref={imgRef}
        />
        <ImgSubmitButton onClick={handleClick} disabled={loading || !photo}>
          확인
        </ImgSubmitButton>
      </EditImgWrapper>
    </UserProfileImgContainer>
  );
}

const UserProfileImgContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MyImageWrapper = styled.div`
  background-color: lightgray;
  margin: 20px auto;
  width: 202px;
  height: 202px;
  border: 2px solid lightgray;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MyImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  text-align: center;
  object-fit: cover;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const EditImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const InputImgFile = styled.input`
  width: 8rem;
  background-color: #656565;
  color: #fff;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
`;

const ImgSubmitButton = styled.button`
  width: 62px;
  height: 28px;
  font-size: 100%;
  background-color: #656565;
  color: #fff;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background-color: #e6e6e6;
    color: #656565;
  }
  &:disabled {
    cursor: auto;
    background-color: #e6e6e6;
    color: #656565;
  }
`;
