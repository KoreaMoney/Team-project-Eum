import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth, upload, auth } from '../../firebase/Firebase';

export default function Profile(params: any) {
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState<any>(auth.currentUser?.photoURL);

  function handleChange(e: any) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  async function handleClick() {
    await upload(photo, currentUser, setLoading);
    const photoURL = async () => {
      await setPhotoURL(currentUser?.photoURL);
    };
    photoURL();
  }

  useEffect(() => {
    if (!auth.currentUser?.photoURL) {
      setPhotoURL('/assets/profileAvatar.png');
    }
  }, []);

  return (
    <UserProfileImgContainer>
      <InputImgFile type="file" onChange={handleChange} />
      <ImgSubmitButton disabled={loading || !photo} onClick={handleClick}>
        확인
      </ImgSubmitButton>
      <MyImageWrapper>
        <MyImage src={photoURL} alt="User Image" />
      </MyImageWrapper>
    </UserProfileImgContainer>
  );
}

const UserProfileImgContainer = styled.div``;

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

const InputImgFile = styled.input`
  margin-left: 52%;
  top: 220px;
  background-color: #656565;
  color: #fff;
  position: absolute;
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
  margin-left: 52%;
  top: 248px;
  position: absolute;
`;
