import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, storageService } from '../../../firebase/Firebase';
import { theme } from '../../../styles/theme';
import { customSuccessAlert } from '../../modal/CustomAlert';
import axios from 'axios';
import styled from 'styled-components';
import Loader from '../../etc/Loader';

export default function Profile() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const imgRef = useRef<HTMLInputElement>(null);
  const [changeFile, setChangeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgEditBtnToggle, setImgEditBtnToggle] = useState(false);

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
        setImgEditBtnToggle(false);
      },
    }
  );

  const saveImgFile = (e: any) => {
    const selectedFile = e.target.files[0];
    setChangeFile(selectedFile);
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

  const shortenUrl = async (img: string) => {
    const imgRef = ref(storageService, `${auth.currentUser?.uid}${Date.now()}`);
    const imgDataUrl = img;
    let downloadUrl;
    if (imgDataUrl) {
      const response = await uploadString(imgRef, imgDataUrl, 'data_url');
      downloadUrl = await getDownloadURL(response.ref);
      setPhoto(downloadUrl);
      setImgEditBtnToggle(true);
    }
  };
  const handleClick = () => {
    editUser({
      ...data,
      profileImg: photo,
    });
  };

  return (
    <UserProfileImgContainer>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MyImageWrapper>
            <MyImage htmlFor="changeImg">
              {changeFile === null ? (
                <img src={data?.[0]?.profileImg} alt="" decoding="async" />
              ) : (
                <img src={URL.createObjectURL(changeFile)} alt="" />
              )}
            </MyImage>
            {imgEditBtnToggle ? (
              <>
                <ImgSubmitButton
                  onClick={handleClick}
                  disabled={loading || !photo}
                  aria-label="프로필 이미지 변경"
                >
                  {photo ? '프로필 이미지 변경' : ''}
                </ImgSubmitButton>
              </>
            ) : null}
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
          </EditImgWrapper>
        </>
      )}
    </UserProfileImgContainer>
  );
}

const UserProfileImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const MyImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 155px;
  height: 195px;
`;

const MyImage = styled.label`
  width: 155px;
  height: 155px;
  border-radius: 100%;
  text-align: center;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    border: 1px solid ${theme.colors.orange02Main};
  }
  img {
    width: 155px;
    height: 155px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const EditImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 155px;
`;

const ImgSubmitButton = styled.button`
  width: 130px;
  height: 1.5rem;
  font-size: 12px;
  background-color: ${theme.colors.white};
  color: ${(props) => props.theme.colors.orange02Main};
  border: 1px solid ${theme.colors.orange02Main};
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 5px;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.white};
    background-color: ${theme.colors.orange03};
  }

  &:active {
    background-color: ${theme.colors.orange02Main};
  }
  &:disabled {
    cursor: auto;
    background-color: transparent;
    border: none;
  }
`;
