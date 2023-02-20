import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

export default function Profile(params: any) {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const { data: getData, isLoading: getLoading } = useQuery(
    ['users', id],
    async () => {
      const response = await axios.get(`http://localhost:4000/users?id=${id}`);
      return response.data;
    }
  );

  const [file, setFile] = useState('');

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profileImage', file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    const response = await axios.post(
      `http://localhost:4000/users/${id}`,
      formData,
      config
    );
    return response.data;
  };

  const { mutate, isLoading } = useMutation(handleUpload, {
    onSuccess: (data) => {
      console.log('Profile image uploaded:', data);
    },
  });

  // const { mutate: editMutate, isLoading: editLoading } = useMutation(
  //   ['users', id],
  //   async (photoURL: any) => {
  //     await axios.patch(`http://localhost:4000/users/${id}`, photoURL);
  //   },
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(['users']);
  //     },
  //     onError: (error) => {
  //       console.log('error: ', error);
  //     },
  //   }
  // );

  // const [photo, setPhoto] = useState('');

  // function handleChange(e: any) {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setPhoto(file);
  //   }
  //   console.log('photo', photo);
  // }

  // async function handleClick() {
  //   const formData = new FormData();
  //   formData.append('profileImg', photo);
  //   const config = {
  //     headers: {
  //       'content-type': 'multipart/form-data',
  //     },
  //   };
  //   await editMutate({ profileImg: formData, config });
  //   console.log('formdata', formData);
  // }

  return (
    <UserProfileImgContainer>
      <MyImageWrapper>
        <MyImage src={getData?.[0].profileImg} alt="User Image" />
      </MyImageWrapper>
      <InputImgFile type="file" onChange={handleFileChange} />
      <ImgSubmitButton
        onClick={() => {
          mutate();
        }}
      >
        확인
      </ImgSubmitButton>
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
