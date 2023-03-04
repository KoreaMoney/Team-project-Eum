import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { RxChevronRight } from 'react-icons/rx';

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
          <Image src="https://ifh.cc/g/Cswrlm.webp " alt="" />
          <Text>
            <p>회원가입 이벤트!!</p>
            <br />
            <p>"50,000" 포인트를 지급해 드립니다.</p>
          </Text>
          <SignUp>
            <Link to="/signup">
              회원가입하러 가기 <Icon size={30} />
            </Link>
          </SignUp>
        </div>
        <Image src="https://ifh.cc/g/C97Oca.webp" alt="" />
        <Image src="https://ifh.cc/g/mqZCnp.webp" alt="" />
        <Image src="https://ifh.cc/g/049LTR.webp" alt="" />
      </Slider>
    </ImageContainer>
  );
};

export default Banner;

const ImageContainer = styled.div`
  width: 50vw;
  margin-bottom: 170px;
  .slick-dots {
    .slick-active {
      button::before {
        color: ${theme.colors.orange03};
      }
    }
    button::before {
      color: ${theme.colors.orange01};
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
const Text = styled.div`
  position: absolute;
  top: 19rem;
  right: 0;
  left: 60rem;
  z-index: 20px;
  color: ${(props) => props.theme.colors.black};
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;

const SignUp = styled.span`
  font-size: ${(props) => props.theme.fontSize.title20};
  position: absolute;
  right: 0;
  left: 990px;
  top: 28rem;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.orange01};
  }
`;

const Icon = styled(RxChevronRight)`
  padding-top: 6px;
  height: 24px;
  width: 24px;
`;
