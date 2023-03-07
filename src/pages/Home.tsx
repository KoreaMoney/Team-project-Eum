import { useNavigate } from 'react-router';
import { postType } from '../types';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import basicIMG from '../styles/basicIMG.webp';
import * as a from '../styles/styledComponent/home';
import { getPosts } from '../api';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { theme } from '../styles/theme';
import loadable from '@loadable/component';

const NextArrow = loadable(() => import('../components/home/NextArrow'));
const PrevArrow = loadable(() => import('../components/home/PrevArrow'));
const Banner = loadable(() => import('../components/home/Banner'));
const Loader = loadable(() => import('../components/etc/Loader'));

/**순서
 * 1. 상단에 위치한 스와이프 제작하기
 * 2. React-query통신하기
 * 3. 조회수 증가 시키기
 * 4. 시간 작성 하기
 */

const Home = () => {
  const navigate = useNavigate();

  // query통신하기
  const { data, isLoading } = useQuery(['posts'], getPosts, {
    staleTime: 5000,
  });

  const result = useQueries({
    queries: [
      {
        queryKey: ['user', 1],
        queryFn: async () => {
          const response = await axios.get(
            `https://orchid-sprinkle-snapdragon.glitch.me/users?_sort=study&_order=DESC&_limit=1`
          );
          return response.data;
        },
      },
      {
        queryKey: ['user', 2],
        queryFn: async () => {
          const response = await axios.get(
            `https://orchid-sprinkle-snapdragon.glitch.me/users?_sort=play&_order=DESC&_limit=1`
          );
          return response.data;
        },
      },
      {
        queryKey: ['user', 3],
        queryFn: async () => {
          const response = await axios.get(
            `https://orchid-sprinkle-snapdragon.glitch.me/users?_sort=advice&_order=DESC&_limit=1`
          );
          return response.data;
        },
      },
      {
        queryKey: ['user', 4],
        queryFn: async () => {
          const response = await axios.get(
            `https://orchid-sprinkle-snapdragon.glitch.me/users?_sort=etc&_order=DESC&_limit=1`
          );
          return response.data;
        },
      },
    ],
  });
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
    autoplay: true,
    autoplaySpeed: 6000,
  };

  return (
    <a.HomeContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Banner />
          </div>
          <a.HomePostContainer>
            <a.HotEum>
              <span>핫한 이음이 친구들</span>
              <p>재능이 가장 많은 이음이 친구들 4분을 모셔봤어요!</p>
            </a.HotEum>
            <HotKingWrapper>
              <>
                <KingBox>
                  <img src="https://ifh.cc/g/5MmCqO.png" alt="" />
                  <KingName>공부신</KingName>
                  <KingNick>{result?.[0]?.data?.[0]?.nickName}</KingNick>
                  <KingContext>공부의 신이 되신걸 축하합니다.</KingContext>
                </KingBox>
                <KingBox>
                  <img src="https://ifh.cc/g/kt0lFx.png" alt="" />
                  <KingName>놀이신</KingName>
                  <KingNick>{result?.[1]?.data?.[0]?.nickName}</KingNick>
                  <KingContext>놀이의 신이 되신걸 축하합니다.</KingContext>
                </KingBox>
                <KingBox>
                  <img src="https://ifh.cc/g/6SGy7o.png" alt="" />
                  <KingName>상담신</KingName>
                  <KingNick>{result?.[2]?.data?.[0]?.nickName}</KingNick>
                  <KingContext>상담의 신이 되신걸 축하합니다.</KingContext>
                </KingBox>
                <KingBox>
                  <img src="https://ifh.cc/g/zHY2xd.png" alt="" />
                  <KingName>기타신</KingName>
                  <KingNick>{result?.[3]?.data?.[0]?.nickName}</KingNick>
                  <KingContext>기타의 신이 되신걸 축하합니다.</KingContext>
                </KingBox>
              </>
            </HotKingWrapper>
            <a.Line />
            <a.HotEum>
              <span>요즘 잘 나가요</span>
              <p> 인기 급상승!&nbsp; 많은 사랑을 받은 이음인이에요!</p>
            </a.HotEum>
            <PostContainer>
              <Slider {...settings}>
                {data
                  ?.slice(0, 9)
                  .sort((a: any, b: any) => b.like.length - a.like.length)
                  .map((post: postType) => (
                    <a.PostWrapper
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                    >
                      <a.PostImg
                        bgPhoto={post.imgURL ? post.imgURL : basicIMG}
                      />
                      <a.PostInfoWrapper>
                        <a.InfoBest>Best</a.InfoBest>
                        <a.InfoTitle>{post.title}</a.InfoTitle>
                        <a.InfoProfile>
                          <a.ProfileIMG
                            profileIMG={
                              post?.profileImg ? post?.profileImg : basicIMG
                            }
                          />
                          <p>
                            {post.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            P
                          </p>
                        </a.InfoProfile>
                        <a.InfoNickName>{post.nickName}</a.InfoNickName>
                      </a.PostInfoWrapper>
                    </a.PostWrapper>
                  ))}
              </Slider>
            </PostContainer>
            <a.Line />
            <a.HotEum>
              <span> 새로운 재능이 나왔어요</span>
              <p>따근따근 방금 올라온 게시물이에요!</p>
            </a.HotEum>
            <PostContainer>
              <Slider {...settings}>
                {data
                  ?.sort((a: any, b: any) => b.createAt - a.createAt)
                  ?.slice(0, 9)
                  .map((post: postType) => (
                    <a.PostWrapper
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                    >
                      <a.PostImg
                        bgPhoto={post.imgURL ? post.imgURL : basicIMG}
                      />
                      <a.PostInfoWrapper>
                        <a.InfoNew>New</a.InfoNew>
                        <a.InfoTitle>{post.title}</a.InfoTitle>
                        <a.InfoProfile>
                          <a.ProfileIMG
                            profileIMG={
                              post?.profileImg ? post?.profileImg : basicIMG
                            }
                          />
                          <p>
                            {post.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            P
                          </p>
                        </a.InfoProfile>
                        <a.InfoNickName>{post.nickName}</a.InfoNickName>
                      </a.PostInfoWrapper>
                    </a.PostWrapper>
                  ))}
              </Slider>
            </PostContainer>
            <a.Line />
          </a.HomePostContainer>
        </>
      )}
    </a.HomeContainer>
  );
};
export default Home;

const HotKingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 130px;
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
