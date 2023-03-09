import { useEffect, useState } from 'react';
import { theme } from '../../styles/theme';
import styled from 'styled-components';

const MoveTop = () => {
  const [toggleBtn, setToggleBtn] = useState(true);

  // window 객체에서 scrollY 값을 받아옴
  // 어느정도 스크롤이 된건지 판단 후, 토글 여부 결정
  const handleScroll = () => {
    const { scrollY } = window;

    scrollY > 50 ? setToggleBtn(true) : setToggleBtn(false);
  };

  // scroll 이벤트 발생 시 이를 감지하고 handleScroll 함수를 실행
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 버튼 클릭 시 스크롤을 맨 위로 올려주는 함수
  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TopContainer>{toggleBtn ? <Btn onClick={goToTop} /> : null}</TopContainer>
  );
};

export default MoveTop;

const TopContainer = styled.div`
  display: flex;
  position: fixed;
  justify-content: end;
  top: 83%;
  height: 60px;
  width: 90%;
  margin-left: 120px;
  z-index: 5;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  outline: none;
  border: none;
  border-radius: 100%;
  background-color: transparent;
  background: url('https://ifh.cc/g/ltzDt4.png') no-repeat;
  background-size: cover;
  cursor: pointer;
  &:hover {
    background: url('https://ifh.cc/g/5kxPq3.png') no-repeat;
    background-size: cover;
  }
  &:active {
    background: url('https://ifh.cc/g/ltzDt4.png') no-repeat;
    background-size: cover;
  }
`;
