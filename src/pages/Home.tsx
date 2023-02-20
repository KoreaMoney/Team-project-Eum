import { useNavigate } from 'react-router';
import { postType } from '../types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import { useEffect, useRef, useState } from 'react';
import { images } from '../components/home/image-data';
import styled from 'styled-components';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  swipeConfidenceThreshold,
  swipePower,
  variants,
} from '../components/home/variants';
const Home = () => {
  const navigate = useNavigate();
  const [[slider, direction], setSlider] = useState([0, 0]);
  const imageRef = useRef(null);
  const imageIndex = wrap(0, images.length, slider);
  
  /**swiper pageination(각각 페이지로 인식하게 하기) */
  const paginate = (newDirection: number) => {
    setSlider([
      (slider + newDirection + images.length) % images.length,
      newDirection,
    ]);
  };

  /**swiper autoplay(자동으로 넘기기) */
  useEffect(() => {
    const interval = setInterval(() => {
      setSlider([slider + 1, 1]);
    }, 5000);
    return () => clearInterval(interval);
  }, [slider]);

  const { data } = useQuery(['users'], async () => {
    const response = await axios.get('http://localhost:4000/posts');
    return response.data;
  });
  return (
    <HomeContainer>
      <SwiperWrapper>
        <AnimatePresence initial={false} custom={direction}>
          <Img
            key={slider}
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          />
        </AnimatePresence>
        <NextPrevWrapper>
          <Prev onClick={() => paginate(-1)}>
            <IoIosArrowBack />
          </Prev>
          <Next onClick={() => paginate(1)}>
            <IoIosArrowForward />
          </Next>
        </NextPrevWrapper>
      </SwiperWrapper>
      <div>
        <TotalWrapper>
          <h1>이음에서 가장 인기</h1>
        </TotalWrapper>
        {data &&
          data.map((item: postType) => {
            return (
              <ListContaier key={item.id}>
                <div
                  onClick={() =>
                    navigate(`/detail/${item.category}/${item.id}`)
                  }
                >
                  <ul>
                    <li>제목 :{item.title}</li>
                    <li>내용 :{item.content}</li>
                    <li>가격 :{item.price}</li>
                  </ul>
                </div>
              </ListContaier>
            );
          })}
      </div>
      <TotalWrapper>
        <h1>전체 글</h1>
        <RecentBox>전체글 들어감</RecentBox>
      </TotalWrapper>
    </HomeContainer>
  );
};
export default Home;
const HomeContainer = styled.div`
  overflow: hidden;
`;
const SwiperWrapper = styled.div`
  width: 60%;
  height: 16em;
  overflow: hidden;
  padding: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .refresh {
    padding: 10px;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;
const Img = styled(motion.img)`
  position: absolute;
  width: 70%;
  height: 15rem;
`;
const NextPrevWrapper = styled.div`
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
const Next = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
  align-items: center;
  user-select: none;
  font-size: 20px;
  z-index: 2;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  left: 50%;
`;
const Prev = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
  align-items: center;
  user-select: none;
  font-size: 20px;
  z-index: 2;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  /* transform: scale(-1); */
`;
const ListContaier = styled.div`
  background-color: gray;
  width: 70%;
  margin: auto;
`;
const TotalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  h1 {
    font-size: 20px;
    padding-left: 15%;
    margin-bottom: 10px;
  }
`;
const RecentBox = styled.div`
  background-color: gray;
  width: 70%;
  height: 40rem;
  margin: auto;
  margin-bottom: 20px;
  padding: 20px;
`;
