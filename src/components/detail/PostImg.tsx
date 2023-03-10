import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { detailPostAtom } from '../../atom';
import { CustomModal } from '../modal/CustomModal';

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
          width="1000"
          height="800"
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
  width: 800px;
  height: 800px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  background-image: url(${(props) => props.img});
`;
