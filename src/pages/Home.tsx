import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { postType } from '../types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import { images } from '../components/home/image-data';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  swipeConfidenceThreshold,
  swipePower,
  variants,
} from '../components/home/variants';
import basicIMG from '../styles/basicIMG.webp';
import parse from 'html-react-parser';
import * as a from '../styles/styledComponent/home';
import { getPosts } from '../api';

/**순서
 * 1. 상단에 위치한 스와이프 제작하기
 * 2. React-query통신하기
 * 3. 조회수 증가 시키기
 * 4. 시간 작성 하기
 */

const Home = () => {
  const navigate = useNavigate();

  const [[slider, direction], setSlider] = useState([0, 0]);
  const imageIndex = wrap(0, images.length, slider);

  //swiper pageInation(각각 페이지로 인식하게 하기)
  const paginate = (newDirection: number) => {
    setSlider([
      (slider + newDirection + images.length) % images.length,
      newDirection,
    ]);
  };

  //swiper autoplay(자동으로 넘기기)
  useEffect(() => {
    const interval = setInterval(() => {
      setSlider([slider + 1, 1]);
    }, 8000);
    return () => clearInterval(interval);
  }, [slider]);

  // query통신하기
  const { data } = useQuery(['posts'], getPosts);

  // 글 클릭하면 조회수 1씩 늘리기!!
  const handlePostClick = async (post: postType) => {
    await axios.patch(`${process.env.REACT_APP_JSON}/posts/${post.id}`, {
      views: post.views + 1,
    });
    navigate(`/detail/${post.category}/${post.id}`);
  };

  //시간 작성 여부 확인하기
  const getTimeGap = (posting: number) => {
    const msGap = Date.now() - posting;
    const minuteGap = Math.floor(msGap / 60000);
    const hourGap = Math.floor(msGap / 3600000);
    if (msGap < 0) {
      return '방금 전';
    }
    if (hourGap > 24) {
      const time = new Date(posting);
      const timeGap = time.toJSON().substring(0, 10);
      return <p>{timeGap}</p>;
    }
    if (minuteGap > 59) {
      return <p>{hourGap}시간 전</p>;
    } else {
      if (minuteGap === 0) {
        return '방금 전';
      } else {
        return <p>{minuteGap}분 전</p>;
      }
    }
  };

  const parsingHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <a.HomeContainer>
      <a.SwiperWrapper>
        <AnimatePresence initial={false} custom={direction}>
          <a.Img
            loading="lazy"
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
        <a.NextPrevWrapper>
          <a.Prev onClick={() => paginate(-1)} aria-label="Prev">
            <IoIosArrowBack />
          </a.Prev>
          <a.Next onClick={() => paginate(1)} aria-label="Next">
            <IoIosArrowForward />
          </a.Next>
        </a.NextPrevWrapper>
      </a.SwiperWrapper>
      <div>
        <a.TotalWrapper>
          <h1>이음의 핫 셀럽</h1>
        </a.TotalWrapper>

        <a.PostsContainer>
          {data
            ?.slice(0, 8)
            .sort((a: any, b: any) => b.like.length - a.like.length)
            .map((post: postType) => (
              <a.PostContainer
                key={post.id}
                onClick={() => handlePostClick(post)}
              >
                <a.PostIMG bgPhoto={post.imgURL ? post.imgURL : basicIMG} />
                <a.ContentContainer>
                  <a.TitleText>{post.title}</a.TitleText>
                  <a.CreateAtText>{getTimeGap(post.createAt)}</a.CreateAtText>
                  <a.ContentText>{parsingHtml(post.content)}</a.ContentText>
                  <a.BottomContainer>
                    <a.LeftContainer>
                      <a.ProfileIMG
                        profileIMG={
                          post?.profileImg ? post?.profileImg : basicIMG
                        }
                      />
                      <p>{post.nickName}</p>
                    </a.LeftContainer>
                    <a.RightContainer>
                      <a.LikeIconContainer>
                        <a.LikeIcon />
                        <span>{post.like.length}</span>
                      </a.LikeIconContainer>
                      <a.PriceText>
                        {post.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        원
                      </a.PriceText>
                    </a.RightContainer>
                  </a.BottomContainer>
                </a.ContentContainer>
              </a.PostContainer>
            ))}
        </a.PostsContainer>
      </div>
    </a.HomeContainer>
  );
};
export default Home;
