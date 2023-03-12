import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api';
import { IoIosArrowForward } from 'react-icons/io';

import Slider from 'react-slick';
import styled from 'styled-components';

const Banner = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    prevArrow: (
      <PrevArrow>
        <img src="https://ifh.cc/g/j7cfsH.png" alt="이전" loading="lazy" />
      </PrevArrow>
    ),
    nextArrow: (
      <NextArrow>
        <img src="https://ifh.cc/g/ARGjlO.png" alt="다음" loading="lazy" />
      </NextArrow>
    ),
  };

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const { data } = useQuery(['userInfo', saveUser?.uid], () =>
    getUsers(saveUser?.uid)
  );

  return (
    <ImageContainer>
      <Slider {...settings}>
        <div>
          <Text>
            <Text1>알파세대를 위한 재능 마켓</Text1>
            <p>재능을 이어주다, 이음</p>
            <span>
              <Link to="/categorypage/all" aria-label="전체" rel="preload">
                <Move>
                  재능 구경하러 가기
                  <IoIosArrowForward />
                </Move>
              </Link>
            </span>
          </Text>
          <Image src="https://ifh.cc/g/BYTr0h.webp" alt="" loading="lazy" />
        </div>
        <div>
          <Text2>
            <Text22>회원가입 시</Text22>
            <p>50,000P 즉시 증정</p>
            <span>
              {data?.id ? (
                <>
                  <Link
                    to="/categorypage/all"
                    aria-label="카테고리 이동"
                    rel="preload"
                  >
                    <Move>
                      재능 구경하러 가기
                      <IoIosArrowForward />
                    </Move>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" aria-label="회원가입으로 이동">
                    <Move>
                      회원가입하러 가기
                      <IoIosArrowForward />
                    </Move>
                  </Link>
                </>
              )}
            </span>
          </Text2>
          <Image src="https://ifh.cc/g/2rVBFv.webp" alt="" loading="lazy" />
        </div>
      </Slider>
    </ImageContainer>
  );
};

export default Banner;

const Move = styled.div`
  display: flex;
  align-items: center;
  border: none;
  height: 60px;
`;

const ImageContainer = styled.div`
  width: 100vw;
  margin-bottom: 100px;
  border: none;
  .slider .slick-list {
    margin: 0 -30px;
  }
  .slider {
    position: relative;
    border: none;
  }
  .slick-prev::before,
  .slick-next::before {
    opacity: 0;
    display: none;
  }
  .slick-slide div {
    cursor: pointer;
  }
`;

const NextArrow = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  margin-right: 10%;
  z-index: 3;
`;

const PrevArrow = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  margin-left: 10%;
  z-index: 3;
`;

const Image = styled.img`
  width: 100%;
  height: 512px;
  margin: auto;
  position: relative;
  border: none;
`;

const Text = styled.div`
  position: absolute;

  top: 20rem;
  left: 27%;
  transform: translate(-50%, -50%);
  font-size: 45px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.black};
  p {
    margin-bottom: 20px;
  }
  span {
    color: ${(props) => props.theme.colors.black};
    font-size: ${theme.fontSize.title20};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    &:hover {
      color: ${(props) => props.theme.colors.gray05};
    }
  }
`;

const Text1 = styled.p`
  margin-bottom: 20px;
  font-display: fallback;
`;

const Text2 = styled.div`
  position: absolute;
  top: 20rem;
  left: 46%;
  transform: translate(-50%, -50%);
  font-size: 45px;
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.black};
  p {
    margin-bottom: 20px;
  }
  span {
    font-size: ${theme.fontSize.title20};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    &:hover {
      color: ${(props) => props.theme.colors.orange02Main};
    }
  }
`;
const Text22 = styled.p`
  margin-bottom: 20px;
  font-display: fallback;
`;
