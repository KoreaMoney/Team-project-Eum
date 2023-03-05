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
import Loader from '../components/etc/Loader';
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
            <a.Line />
            <a.HotEum>
              <span>요즘 잘 나가요</span>
              <p>많은 사랑을 받은 이음인이에요!</p>
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
                            원
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
              <span>새로운 재능이 나왔어요</span>
              <p>따근따근 방금 올라온 게시물이에요!</p>
            </a.HotEum>
            <NewContentsWrapper>
              <Slider {...settings}>
                {data
                  ?.sort((a: any, b: any) => b.createAt - a.createAt)
                  ?.slice(0, 9)
                  .map((post: postType) => (
                    <div key={post.id} onClick={() => handlePostClick(post)}>
                      <a.PostImg
                        bgPhoto={post.imgURL ? post.imgURL : basicIMG}
                      />
                      <a.PostInfoWrapper>
                        <InfoNew>New</InfoNew>
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
                            원
                          </p>
                        </a.InfoProfile>
                        <a.InfoNickName>{post.nickName}</a.InfoNickName>
                      </a.PostInfoWrapper>
                    </div>
                  ))}
              </Slider>
            </NewContentsWrapper>
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
      color: ${theme.colors.orange02Main};
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
      color: ${theme.colors.orange02Main};
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
