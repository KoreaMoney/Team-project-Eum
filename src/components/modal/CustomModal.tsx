import { Dispatch, SetStateAction, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { viewBuyerModalAtom } from '../../atom';
import { theme } from '../../styles/theme';

interface ModalProps {
  modal: any;
  width: string;
  height: string;
  overflow: string;
  element: JSX.Element;
  setModal: Dispatch<SetStateAction<boolean>>;
}

export const CustomModal = ({
  width,
  height,
  element,
  setModal,
  overflow,
}: ModalProps) => {
  const disableModal = () => {
    setModal(false);
  };

  const isModalActive = useRecoilValue(viewBuyerModalAtom);

  const onClickToggleModal = useCallback(() => {
    setModal(false);
  }, [isModalActive]);

  return (
    <>
      <Container width={width} height={height} overflow={overflow}>
        <Wrapper>{element}</Wrapper>
        <CloseButton onClick={onClickToggleModal} aria-label="닫기">
          X
        </CloseButton>
      </Container>
      <Canvas onClick={disableModal} />
    </>
  );
};

const CloseButton = styled.button`
  position: absolute;
  font-size: 24px;
  font-weight: 600;
  width: 40px;
  height: 40px;
  right: 12px;
  top: 12px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    color: ${theme.colors.orange02Main};
  }
`;

const Container = styled.div<{
  width: string;
  height: string;
  overflow: string;
}>`
  position: fixed;
  display: flex;
  flex-direction: column;
  left: calc(50vw - ${(props) => props.width}px / 2);
  top: calc(50vh - ${(props) => props.height}px / 2);
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  padding: 8px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  z-index: 10000;
  color: ${theme.colors.white};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: ${theme.fontSize.title20};
  border: none;
  overflow: ${(props) => props.overflow};
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150vw;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const Wrapper = styled.div`
  background-color: transparent;
`;
