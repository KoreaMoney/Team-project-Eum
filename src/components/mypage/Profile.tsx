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
        shortenUrl(resultImg as string);
      };
    }

    const shortenUrl = async (img: string) => {
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
      }
    };
  };
  const handleClick = async () => {
    await editUser({
      ...data,
      profileImg: photo,
    });
  };

  return (
    <UserProfileImgContainer>
      <MyImageWrapper>
        <MyImage htmlFor="changeImg">
          <img src={data?.[0]?.profileImg} alt="" decoding="async" />
        </MyImage>
      </MyImageWrapper>
      <EditImgWrapper>
        <input
          hidden
          type="file"
          id="changeImg"
          onChange={saveImgFile}
          ref={imgRef}
          name="profile_img"
          accept="image/*"
        />
        <ImgSubmitButton
          onClick={handleClick}
          disabled={loading || !photo}
          aria-label="프로필 이미지 변경"
        >
          {!photo ? ' ' : '프로필 이미지 변경'}
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
  background-image: url('https://ifh.cc/g/OoQLa8.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin: 20px auto;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MyImage = styled.label`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  text-align: center;
  overflow: hidden;

  &:hover {
    cursor: pointer;
    border: 3px solid tomato;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const EditImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
`;

const ImgSubmitButton = styled.button`
  width: 100%;
  height: 2rem;
  font-size: 16px;
  background-color: yellow;
  color: ${(props) => props.theme.colors.gray50};
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    border: 3px solid tomato;
  }

  &:active {
    background-color: tomato;
  }
  &:disabled {
    cursor: auto;
    background-color: transparent;
    border: none;
  }
`;
