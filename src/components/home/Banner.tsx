import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';
import Slider from 'react-slick';
import styled from 'styled-components';
import { HiChevronRight } from 'react-icons/hi2';

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: true,
    autoplaySpeed: 8000,
  };

  return (
    <ImageContainer>
      <Slider {...settings}>
        <div>
          <Image src="https://ifh.cc/g/1mcNzR.webp" alt="" loading="lazy" />
          <Text>
            <Text1>회원가입 시</Text1>
            <p>50,000P 즉시 지급!</p>
            <span>
              <Link to="/signup" aria-label="회원가입으로 이동">
                <Move>
                  회원가입하러 가기
                  <img src="https://ifh.cc/g/PyYoKP.png" alt="이동" />
                </Move>
              </Link>
            </span>
          </Text>
        </div>
        <div>
          <Image src="https://ifh.cc/g/f3oFYw.webp" alt="" loading="lazy" />
          <Text2>
            <Text22>저절로 얼굴에</Text22>
            <p>스마일이 지어는 시간</p>
            <span>
              <Link to="/categorypage/play" aria-label="놀이 이동">
                <Move>
                  스마일 만드는 시간
                  <img src="https://ifh.cc/g/PyYoKP.png" alt="이동" />
                </Move>
              </Link>
            </span>
          </Text2>
        </div>
        <div>
          <Image src="https://ifh.cc/g/cL6TKb.webp" alt="" loading="lazy" />
          <Text3>
            <Text33>수학 풀이를 봐도</Text33>
            <p>이해가 안되신다구요?</p>
            <span>
              <Link to="/categorypage/study" aria-label=" 공부 이동">
                <Move>
                  모르는 수학 문제 바로 풀어드려요!
                  <img src="https://ifh.cc/g/PyYoKP.png" alt="이동" />
                </Move>
              </Link>
            </span>
          </Text3>
        </div>
        <div>
          <Image src="https://ifh.cc/g/XA83gW.webp" alt="" loading="lazy" />
          <Text4>
            <Text44>500원으로</Text44>
            <p>더 예뻐지고 싶으시다구요?</p>
            <span>
              <Link to="/categorypage/advice" aria-label="상담 이동">
                <Move>
                  사진 보정해드려요
                  <img src="https://ifh.cc/g/PyYoKP.png" alt="이동" />
                </Move>
              </Link>
            </span>
          </Text4>
        </div>
        <div>
          <Image src="https://ifh.cc/g/ThpO56.webp" alt="" loading="lazy" />
          <Text5>
            <Text55>인플루언서가</Text55>
            <p>되고 싶다면?</p>
            <span>
              <Link to="/categorypage/etc" aria-label="기타 이동">
                <Move>
                  인스타그램 팔로잉 해드려요
                  <img src="https://ifh.cc/g/PyYoKP.png" alt="이동" />
                </Move>
              </Link>
            </span>
          </Text5>
        </div>
      </Slider>
    </ImageContainer>
  );
};

export default Banner;

const Move = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
`;

const ImageContainer = styled.div`
  width: 80vw;
  margin-bottom: 56px;
  .slick-dots {
    position: absolute;
    top: 34rem;
    .slick-active {
      button::before {
        color: ${theme.colors.black};
      }
    }
    button::before {
      color: ${theme.colors.gray30};
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
  width: 990px;
  height: 600px;
  margin: auto;
  position: relative;
`;

const Text = styled.div`
  position: absolute;
  top: 27rem;
  left: 12.3%;
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

const Text1 = styled.p`
  margin-bottom: 20px;
`;

const Text2 = styled.div`
  position: absolute;
  top: 26rem;
  left: 21.5%;
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
`;

const Text3 = styled.div`
  position: absolute;
  top: 26rem;
  left: 30.7%;
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
const Text33 = styled.p`
  margin-bottom: 20px;
`;

const Text4 = styled.div`
  position: absolute;
  top: 26rem;
  left: 40.2%;
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
const Text44 = styled.p`
  margin-bottom: 20px;
`;

const Text5 = styled.div`
  position: absolute;
  top: 26rem;
  left: 48.5%;
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
const Text55 = styled.p`
  margin-bottom: 20px;
`;
