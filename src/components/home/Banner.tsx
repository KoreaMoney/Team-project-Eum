import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
    pauseOnHover: true,
    autoplay: true,
    autoplaySpeed: 10000,
  };

  return (
    <ImageContainer>
      <Slider {...settings}>
        <div>
          <Image src="https://ifh.cc/g/ofO3ts.jpg " alt="" />
          <Text>
            <p>지금 회원가입하면 이벤트로</p>
            <br />
            <p> &nbsp;&nbsp;&nbsp;&nbsp;"50,000" 포인트를 지급해 드립니다.</p>
          </Text>
        </div>
        <div>
          <Image src="https://ifh.cc/g/C97Oca.webp" alt="" />
          <Text2>
            <p>세상에 모든 재능은 가치를 이어주다.</p>
            <br />
            <span>이음</span>
          </Text2>
        </div>

        <Image src="https://ifh.cc/g/mqZCnp.webp" alt="" />
        <Image src="https://ifh.cc/g/049LTR.webp" alt="" />
      </Slider>
    </ImageContainer>
  );
};

export default Banner;

const ImageContainer = styled.div`
  width: 60vw;
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
  /* .slick-prev:before,
  .slick-next:before {
    color: ${theme.colors.orange03};
    font-size: 27px;
  }
  .slick-prev:before {
    margin-right: 30px;
  } */
`;

const Image = styled.img`
  width: 1200px;
  height: 650px;
  position: relative;
`;
const Text = styled.div`
  position: absolute;
  top: 20rem;
  right: 0;
  left: 1210px;
  color: ${(props) => props.theme.colors.black};
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;
const Text2 = styled.div`
  position: absolute;
  top: 20rem;
  right: 0;
  left: 2260px;
  color: ${(props) => props.theme.colors.black};
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  span {
    font-size: ${(props) => props.theme.fontSize.title32};
  }
`;
