import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef, useCallback, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { postType } from '../types';
import { AiFillHeart } from 'react-icons/ai';
import basicIMG from '../styles/basicIMG.png';

/** 전체, 놀이 등 카테고리를 클릭하면 이동되는 페이지입니다.
 * 어떤 DATA의 URL이 들어가는 먼저 넣기
 * 무한 스크롤 구현하기
 */

const CategoryPage = () => {
  const navigate = useNavigate();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const { categoryName, select, word } = useParams();
  const observerElem = useRef<HTMLDivElement | null>(null);

  const PAGE_SIZE = 12;

  //fetchPost Category setUp
  const fetchPosts = async (
    key: string,
    categoryName: string,
    select: string | undefined,
    word: string | undefined,
    page = 0
  ) => {
    const baseUrl = `${process.env.REACT_APP_JSON}/posts`;
    let url = baseUrl;
    if (categoryName !== 'all' && !word) {
      url = `${baseUrl}?category=${categoryName}`;
    } else if (categoryName === 'all' && word) {
      url = `${baseUrl}?${select}_like=${word}`;
    } else if (categoryName !== 'all' && word) {
      url = `${baseUrl}?category=${categoryName}&${select}_like=${word}`;
    }

    const response = await axios.get(url, {
      params: {
        _page: page,
        _limit: PAGE_SIZE,
      },
    });
    return response.data;
  };

  /**useQueryClient() : QueryClient 객체를 가져올 수 있는 함수
   * QueryClient: 캐시,쿼리관리,상태업데이트 등을 처리하는 핵심객체, 데이터 업데이트 후 ui를 갱신하거나 서버에 데이터를 새로 요청하고 업데이트된 데이터를 받아와 ui를 갱신하는 등의 작업을 할 수 있다고 함.
   */
  const queryClient = useQueryClient();

  /** 글 클릭하면 조회수 1씩 늘어난다
   * 특정 데이터만을 업데이트 하고싶으면 위 방법을 통해 가능합니다.
   * ${post.id} 라는건 http://localho1st:4000/posts 주소의 데이터에서 내가 받은 post.id와 동일한 객체를 찾아줍니다.
   * fetchQuery : useQueryClient를 사용하여 queryClient 객체를 가져오고, 해당 쿼리를 다시 가져와서 데이터를 다시 로드할 수 있도록 하는 메서드 라고 한다.
   * axios로 patch요청을 보낸 후 45번줄을 호출해서 post목록 쿼리를 다시 가져와서 최신의 데이터를 가져올 수 있다고 한다.
   */

  //버튼 누르면 data patch되게 한다
  const handlePostClick = async (post: postType) => {
    await axios.patch(`${process.env.REACT_APP_JSON}/posts/${post.id}`, {
      views: post.views + 1,
    });
    queryClient.fetchQuery(['posts', categoryName ?? 'all']);
    navigate(`/detail/${post.category}/${post.id}`);
  };

  // 7일 이상이 된 댓글은 yyyy-mm-dd hh:mm 형식으로 출력됩니다.
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

  //카테고리 무한 스크롤
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(
      ['posts', categoryName ?? 'all', select, word],
      ({ pageParam = 0 }) =>
        fetchPosts('posts', categoryName ?? 'all', select, word, pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return lastPage.length !== 0 ? nextPage : undefined;
        },
      }
    );

  //무한스크롤 observer
  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerElem.current;
    if (element === null) return;
    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return (
    <PageContainer>
      {saveUser && (
        <NavContainer>
          <CategoryName>
            {categoryName === 'all'
              ? '전체'
              : categoryName === 'study'
              ? '공부'
              : categoryName === 'play'
              ? '놀이'
              : categoryName === 'advice'
              ? '상담'
              : categoryName === 'etc'
              ? '기타'
              : '전체'}
          </CategoryName>
          <WriteButton
            onClick={() => {
              navigate('/writepage');
            }}
          >
            글쓰기
          </WriteButton>
        </NavContainer>
      )}
      <PostsContainer>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((post: postType) => (
              <PostContainer
                key={post.id}
                onClick={() => handlePostClick(post)}
              >
                <PostIMG bgPhoto={post.imgURL ? post.imgURL : basicIMG} />
                <ContentContainer>
                  <TitleText>{post.title}</TitleText>
                  <CreateAtText>{getTimeGap(post.createAt)}</CreateAtText>
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
                        {post.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                        원
                      </PriceText>
                    </RightContainer>
                  </BottomContainer>
                </ContentContainer>
              </PostContainer>
            ))}
          </Fragment>
        ))}

        <PostContainer ref={observerElem}>
          <EndPostDiv>
            {isFetching || isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Scroll to load more posts'
              : 'No more posts'}
          </EndPostDiv>
        </PostContainer>
      </PostsContainer>
    </PageContainer>
  );
};

export default CategoryPage;

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
  background-color: ${(props) => props.theme.colors.brandColor};
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
  border: 3px solid ${(props) => props.theme.colors.brandColor};
`;

const PostIMG = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 10rem;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 247px;
  padding: 1.5rem 2rem 1rem;
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
  align-items: center;
  gap: 0.5rem;
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
  align-items: center;
  gap: 0.5rem;
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
  color: ${(props) => props.theme.colors.red};
  font-size: 30px; // props로 변경해야함.
`;

const LikeCountText = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: ${(props) => props.theme.fontSize.label12};
  line-height: ${(props) => props.theme.fontSize.title24};
  color: ${(props) => props.theme.colors.gray10};
  height: ${(props) => props.theme.fontSize.title24};
`;

const PriceText = styled.p`
  font-size: ${(props) => props.theme.fontSize.bottom20};
  color: ${(props) => props.theme.colors.gray60};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;

const EndPostDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.title24};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  color: ${(props) => props.theme.colors.gray60};
  height: 100%;
`;
