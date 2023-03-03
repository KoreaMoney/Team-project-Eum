import { useNavigate } from 'react-router';
import { postType } from '../types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import basicIMG from '../styles/basicIMG.webp';
import * as a from '../styles/styledComponent/home';
import { getPosts } from '../api';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from '../components/home/NextArrow';
import PrevArrow from '../components/home/PrevArrow';
import Slider from 'react-slick';
import { theme } from '../styles/theme';
import Banner from '../components/home/Banner';

/**순서
 * 1. 상단에 위치한 스와이프 제작하기
 * 2. React-query통신하기
 * 3. 조회수 증가 시키기
 * 4. 시간 작성 하기
 */

const Home = () => {
  const navigate = useNavigate();

  // query통신하기
  const { data } = useQuery(['posts'], getPosts, {
    staleTime: 5000,
  });

  // 글 클릭하면 조회수 1씩 늘리기!!
  const handlePostClick = async (post: postType) => {
    await axios.patch(`${process.env.REACT_APP_JSON}/posts/${post.id}`, {
      views: post.views + 1,
    });
    navigate(`/detail/${post.category}/${post.id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    draggable: true,
  };

  return (
    <HomeContainer>
      <div>
        <Banner />
      </div>

      <HomePostContainer>
        <HotEum>
          <span>핫한 이음이 친구들</span>
          <p>재능이 가장 많은 이음이 친구들 4분을 모셔봤어요!</p>
        </HotEum>
        <HotKingWrapper>
          <KingBox>
            <img src="https://ifh.cc/g/5MmCqO.png" alt="" />
            <KingName>공부신</KingName>
            <KingNick>닉네임</KingNick>
            <KingContext>여기에는 내용이 들어갑니다</KingContext>
          </KingBox>
          <KingBox>
            <img src="https://ifh.cc/g/kt0lFx.png" alt="" />
            <KingName>놀이신</KingName>
            <KingNick>닉네임</KingNick>
            <KingContext>여기에는 내용이 들어갑니다</KingContext>
          </KingBox>
          <KingBox>
            <img src="https://ifh.cc/g/6SGy7o.png" alt="" />
            <KingName>상담신</KingName>
            <KingNick>닉네임</KingNick>
            <KingContext>여기에는 내용이 들어갑니다</KingContext>
          </KingBox>
          <KingBox>
            <img src="https://ifh.cc/g/zHY2xd.png" alt="" />
            <KingName>기타신</KingName>
            <KingNick>닉네임</KingNick>
            <KingContext>여기에는 내용이 들어갑니다</KingContext>
          </KingBox>
        </HotKingWrapper>
        <Line />
        <HotEum>
          <span>요즘 잘 나가요</span>
          <p>많은 사랑을 받은 이음인이에요!</p>
        </HotEum>
        <PostContainer>
          <Slider {...settings}>
            {data
              ?.slice(0, 9)
              .sort((a: any, b: any) => b.like.length - a.like.length)
              .map((post: postType) => (
                <PostWrapper
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                >
                  <PostImg bgPhoto={post.imgURL ? post.imgURL : basicIMG} />
                  <PostInfoWrapper>
                    <InfoBest>Best</InfoBest>
                    <InfoTitle>{post.title}</InfoTitle>
                    <InfoProfile>
                      <ProfileIMG
                        profileIMG={
                          post?.profileImg ? post?.profileImg : basicIMG
                        }
                      />
                      <p>
                        {post.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        원
                      </p>
                    </InfoProfile>
                    <InfoNickName>{post.nickName}</InfoNickName>
                  </PostInfoWrapper>
                </PostWrapper>
              ))}
          </Slider>
        </PostContainer>
        <Line />
        <HotEum>
          <span>새로운 재능이 나왔어요</span>
          <p>따근따근 방금 올라온 게시물이에요!</p>
        </HotEum>
        <NewContentsWrapper>
          <Slider {...settings}>
            {data
              ?.sort((a: any, b: any) => b.createAt - a.createAt)
              ?.slice(0, 9)
              .map((post: postType) => (
                <div key={post.id} onClick={() => handlePostClick(post)}>
                  <PostImg bgPhoto={post.imgURL ? post.imgURL : basicIMG} />
                  <PostInfoWrapper>
                    <InfoNew>New</InfoNew>
                    <InfoTitle>{post.title}</InfoTitle>
                    <InfoProfile>
                      <ProfileIMG
                        profileIMG={
                          post?.profileImg ? post?.profileImg : basicIMG
                        }
                      />
                      <p>
                        {post.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        원
                      </p>
                    </InfoProfile>
                    <InfoNickName>{post.nickName}</InfoNickName>
                  </PostInfoWrapper>
                </div>
              ))}
          </Slider>
        </NewContentsWrapper>
      </HomePostContainer>
    </HomeContainer>
  );
};
export default Home;
const Line = styled.div`
  width: 1200px;
  height: 56px;
  border-top: 2px solid ${theme.colors.gray10};
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HomePostContainer = styled.div`
  width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const HotEum = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;

  span {
    font-size: ${(props) => props.theme.fontSize.title32};
    font-weight: ${(props) => props.theme.fontWeight.bold};
    margin-bottom: 20px;
  }
  p {
    font-size: ${(props) => props.theme.fontSize.title16};
    margin-bottom: 15px;
  }
`;

const HotKingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 128px;
`;
const KingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 280px;
  height: 320px;
  gap: 14px;
  img {
    width: 100%;
    height: 220px;
  }
`;

const KingName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title14};
  color: ${(props) => props.theme.colors.gray30};
`;
const KingNick = styled.p`
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;
const KingContext = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
`;

const PostContainer = styled.div`
  width: 60vw;
  height: 300px;
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
  .slick-prev:before,
  .slick-next:before {
    color: ${theme.colors.orange03};
    font-size: 25px;
  }
  .slick-prev:before {
    margin-right: 30px;
  }
`;

const PostWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 370px;
  height: 352px;
`;

const PostImg = styled.div<{ bgPhoto: string }>`
  width: 70%;
  height: 200px;
  margin: auto;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
`;

const PostInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  line-height: 32px;
`;

const InfoBest = styled.div`
  text-decoration: underline;
  color: ${theme.colors.green};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

const InfoTitle = styled.span`
  font-size: ${(props) => props.theme.fontSize.title20};
`;

const InfoProfile = styled.div`
  font-size: ${(props) => props.theme.fontSize.title18};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
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

const InfoNickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  color: ${theme.colors.gray30};
`;

const NewContentsWrapper = styled.div`
  width: 60vw;
  height: 300px;
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
  .slick-prev:before,
  .slick-next:before {
    color: ${theme.colors.orange03};
    font-size: 25px;
  }
  .slick-prev:before {
    margin-right: 30px;
  }
`;

const InfoNew = styled.div`
  text-decoration: underline;
  color: ${theme.colors.Blue};
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;
