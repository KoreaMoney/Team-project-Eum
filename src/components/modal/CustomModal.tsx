import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ModalProps {
  modal: any;
  width: string;
  height: string;
  element: JSX.Element;
  setModal: Dispatch<SetStateAction<boolean>>;
}

export const CustomModal = ({
  width,
  height,
  element,
  setModal,
}: ModalProps) => {
  const disableModal = () => {
    setModal(false);
  };

  return (
    <>
      <Container width={width} height={height}>
        <Wrapper>{element}</Wrapper>
      </Container>
      <Canvas onClick={disableModal} />
    </>
  );
};

const Container = styled.div<{ width: string; height: string }>`
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
  overflow: scroll;
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const Wrapper = styled.div`
  background-color: transparent;
`;
