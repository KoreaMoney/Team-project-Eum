import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TiArrowUpOutline } from 'react-icons/ti';

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
    <div>
      {toggleBtn ? (
        <UpBtn>
          <TiArrowUpOutline onClick={goToTop} size={40} />
        </UpBtn>
      ) : null}
    </div>
  );
};

export default MoveTop;

const UpBtn = styled.span`
  color: ${(props) => props.theme.colors.black};
  display: flex;
  justify-content: end;
  margin-right: 2rem;
`;
