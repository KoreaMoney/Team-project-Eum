import { useCallback, useEffect, useState } from 'react';
import { detailPostAtom } from '../../atom';
import { CustomModal } from '../modal/CustomModal';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const PostImg = () => {
  const postData = useRecoilValue(detailPostAtom);

  const [isModalActive, setIsModalActive] = useState(false);
  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = isModalActive ? 'hidden' : 'auto';
      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [isModalActive]);

  return (
    <>
      <PostImage
        img={postData?.[0]?.imgURL}
        aria-label="post이미지"
        onClick={onClickToggleModal}
      />
      {isModalActive ? (
        <CustomModal
          modal={isModalActive}
          setModal={setIsModalActive}
          width="800"
          height="600"
          overflow="scroll"
          element={<ModalImage img={postData?.[0]?.imgURL} />}
        />
      ) : (
        ''
      )}
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

export const ModalImage = styled.div<{ img: string | undefined }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 700px;
  height: 600px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  background-image: url(${(props) => props.img});
`;
