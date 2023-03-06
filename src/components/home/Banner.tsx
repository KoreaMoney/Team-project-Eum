import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { RxChevronRight } from 'react-icons/rx';
import Slider from 'react-slick';
import styled from 'styled-components';

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: true,
    autoplaySpeed: 10000,
  };

  return (
    <ImageContainer>
      <Slider {...settings}>
        <div>
          <Image src="https://ifh.cc/g/RZyJOY.webp " alt="" loading="lazy" />
          <Text>
            <p>회원가입 이벤트!!</p>
            <br />
            <p>"50,000" 포인트를 지급해 드립니다.</p>
          </Text>
          <SignUp>
            <Link to="/signup" aria-label="회원가입으로 이동">
              회원가입하러 가기 <Icon size={30} />
            </Link>
          </SignUp>
        </div>
        <div>
          <Image1 src="https://ifh.cc/g/2x2nVj.webp" alt="" loading="lazy" />
          <Text1>
            <span>세상에 모든 재능을 이음</span>
            <br />
            <p>가장 작은 재능이</p>
            <p>가장 큰 가치를 가진다.</p>
            <button
              onClick={() =>
                window.open('https://forms.gle/ut6gMUXJZ8pTqkvz7', '_blank')
              }
              aria-label="설문조사하러 이동"
            >
              더 나은 이음을 위해 설문하러 가기
            </button>
          </Text1>
        </div>
        <Image src="https://ifh.cc/g/8O0vYz.webp" alt="" loading="lazy" />
        <Image src="https://ifh.cc/g/jNVbX8.webp" alt="" loading="lazy" />
      </Slider>
    </ImageContainer>
  );
};

export default Banner;

const ImageContainer = styled.div`
  width: 56vw;
  margin-bottom: 170px;
  .slick-dots {
    .slick-active {
      button::before {
        color: ${theme.colors.orange03};
      }
    }
    button::before {
      color: ${theme.colors.orange02Main};
    }
  }
  .slider .slick-list {
    margin: 0 -30px;
  }
  .slider {
    position: relative;
  }
`;

const Image = styled.img`
  width: 700px;
  height: 600px;
  margin: auto;
  position: relative;
`;

const Image1 = styled.img`
  width: 700px;
  height: 600px;
  margin: auto;
  position: relative;
`;
const Text = styled.div`
  position: absolute;
  top: 22rem;
  left: 15%;
  transform: translate(-50%, -50%);
  color: ${(props) => props.theme.colors.black};
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;

const SignUp = styled.span`
  font-size: ${(props) => props.theme.fontSize.title20};
  position: absolute;
  left: 13%;
  top: 27.5rem;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;

const Icon = styled(RxChevronRight)`
  padding-top: 6px;
  height: 24px;
  width: 24px;
`;

const Text1 = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  font-size: 35px;
  color: ${theme.colors.white};
  z-index: 3px;
  height: 30%;
  top: 18rem;
  left: 24.5%;
  span {
    text-shadow: 1px 2px 2px ${theme.colors.black};
  }
  p {
    margin-bottom: 10px;
    text-shadow: 1px 2px 2px ${theme.colors.black};
  }
  button {
    display: flex;
    align-items: center;
    margin-top: 10px;
    background-color: transparent;
    font-weight: ${theme.fontWeight.medium};
    font-size: ${(props) => props.theme.fontSize.title18};
    border: none;
    outline: none;
    color: ${theme.colors.orange02Main};
    &:hover {
      cursor: pointer;
    }
  }
`;
