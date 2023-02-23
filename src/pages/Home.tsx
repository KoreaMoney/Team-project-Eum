import { useNavigate } from 'react-router';
import { postType } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import { Fragment, useEffect, useState } from 'react';
import { images } from '../components/home/image-data';
import styled from 'styled-components';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  swipeConfidenceThreshold,
  swipePower,
  variants,
} from '../components/home/variants';
import { AiFillHeart } from 'react-icons/ai';
import basicIMG from '../styles/basicIMG.png';
import parse from 'html-react-parser';
const Home = () => {
  const navigate = useNavigate();
  const [[slider, direction], setSlider] = useState([0, 0]);
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
    }, 8000);
    return () => clearInterval(interval);
  }, [slider]);

  const { data } = useQuery(['posts'], async () => {
    const response = await axios.get(`${process.env.REACT_APP_JSON}/posts`);
    return response.data;
  });

  const queryClient = useQueryClient();
  const handlePostClick = async (post: postType) => {
    await axios.patch(`${process.env.REACT_APP_JSON}/posts/${post.id}`, {
      views: post.views + 1, // 글 클릭하면 조회수 1씩 늘리기!!
    });
    navigate(`/detail/${post.category}/${post.id}`);
  };
  const getTimegap = (posting: number) => {
    const msgap = Date.now() - posting;
    const minutegap = Math.floor(msgap / 60000);
    const hourgap = Math.floor(msgap / 3600000);
    if (msgap < 0) {
      return '방금 전';
    }
    if (hourgap > 24) {
      const time = new Date(posting);
      const timegap = time.toJSON().substring(0, 10);
      return <p>{timegap}</p>;
    }
    if (minutegap > 59) {
      return <p>{hourgap}시간 전</p>;
    } else {
      if (minutegap === 0) {
        return '방금 전';
      } else {
        return <p>{minutegap}분 전</p>;
      }
    }
  };

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
          <h1>이음의 핫 셀럽</h1>
        </TotalWrapper>

        <PostsContainer>
          {data?.slice(0, 8).sort((a:any,b:any)=>b.like.length - a.like.length).map((post: postType) => (
            <PostContainer key={post.id} onClick={() => handlePostClick(post)}>
              <PostIMG bgPhoto={post.imgURL ? post.imgURL : basicIMG} />
              <ContentContainer>
                <TitleText>{post.title}</TitleText>
                <CreateAtText>{getTimegap(post.createAt)}</CreateAtText>
                <ContentText>{parse(post.content)}</ContentText>
                <BottomContainer>
                  <LeftContainer>
                    <ProfileIMG
                      profileIMG={
                        post?.profileImg ? post?.profileImg : basicIMG
                      }
                    />
                    <NickNameText>{post.nickName}</NickNameText>
                  </LeftContainer>
                  <RightContainer>
                    <LikeIconContainer>
                      <LikeIcon />
                      <LikeCountText>{post.like.length}</LikeCountText>
                    </LikeIconContainer>
                    <PriceText>
                      {post.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원
                    </PriceText>
                  </RightContainer>
                </BottomContainer>
              </ContentContainer>
            </PostContainer>
          ))}
        </PostsContainer>
      </div>
    </HomeContainer>
  );
};
export default Home;
const HomeContainer = styled.div`
  overflow: hidden;
  width: 70%;
  margin: 0 auto;
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
  border-radius: 6px;
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
const ListContainer = styled.div`
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
    
    margin: 3rem 0 1rem;
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
const PostIMG = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 10rem;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const PageContainer = styled.div`
  width: 70%;
  margin: 0 auto;
`;
const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;
const CategoryName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title24};
  color: ${(props) => props.theme.colors.gray60};
`;
const WriteButton = styled.button`
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.gray60};
  background-color: #ffda18;
  border: none;
  width: 7rem;
  height: 2rem;
  cursor: pointer;
  &:hover {
  }
`;
const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;
const PostContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  border: 3px solid #ffda18;
`;

const ContentContainer = styled.div`
height: 247px;
  padding: 1.5rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const TitleText = styled.h2`
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
  text-shadow: 1px 1px 2px gray;
`;

const CreateAtText = styled.div`
  font-size: ${(props) => props.theme.fontSize.label12};
  color: ${(props) => props.theme.colors.gray20};
  text-align: right;
  margin: 0.5rem 0;
`;

const ContentText = styled.div`
  font-size: ${(props) => props.theme.fontSize.body16};
  color: ${(props) => props.theme.colors.gray60};
  width: 100%;
  height: 8rem;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const LeftContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
const ProfileIMG = styled.div<{ profileIMG: string | undefined | null }>`
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;
const NickNameText = styled.p`
  font-size: ${(props) => props.theme.fontSize.label12};
  color: ${(props) => props.theme.colors.gray20};
`;
const RightContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const LikeIconContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 0.5rem;
`;
const LikeIcon = styled(AiFillHeart)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 30px; // props로 변경해야함.
`;
const LikeCountText = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: ${(props) => props.theme.fontSize.label12};
  color: ${(props) => props.theme.colors.gray10};
  height: ${(props) => props.theme.fontSize.title24};
  line-height: ${(props) => props.theme.fontSize.title24};
`;
const PriceText = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
  color: ${(props) => props.theme.colors.gray60};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;
const EndPostDiv = styled.div`
  display: flex;
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
  text-align: center;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
