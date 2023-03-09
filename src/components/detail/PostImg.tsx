import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { detailPostAtom } from '../../atom';

const PostImg = () => {
  const postData = useRecoilValue(detailPostAtom);
  return (
    <>
      <PostImage
        img={postData?.[0].imgURL}
        aria-label="post이미지"
        onClick={() => {
          window.open(postData?.[0].imgURL);
        }}
      />
    </>
  );
};

export default PostImg;
export const PostImage = styled.div<{ img: string | undefined }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 588px;
  height: 539px;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.img});
  cursor: pointer;
`;
