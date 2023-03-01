import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef, useCallback, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { postType } from '../types';
import basicIMG from '../styles/basicIMG.webp';
import * as a from '../styles/styledComponent/category';

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
        _sort: 'createAt', // createAt 필드를 기준으로 정렬
        _order: 'desc', // 내림차순으로 정렬
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
    const queryFn = async () => {
      const data = await fetchPosts(
        'posts',
        categoryName ?? 'all',
        select,
        word
      );
      return data;
    };
    queryClient.fetchQuery(['posts', post.id], queryFn); // queryFn 함수 호출
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
      return timeGap;
    }
    if (minuteGap > 59) {
      return `${hourGap}시간 전`;
    } else {
      if (minuteGap === 0) {
        return '방금 전';
      } else {
        return `${minuteGap}분 전`;
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
  console.log('data: ', data?.pages);

  const parsingHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

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
    <a.PageContainer>
      {saveUser && (
        <a.NavContainer>
          <p>
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
          </p>
          <button
            onClick={() => {
              navigate('/writepage');
            }}
          >
            글쓰기
          </button>
        </a.NavContainer>
      )}
      <a.PostsContainer>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((post: postType) => (
              <a.PostContainer
                key={post.id}
                onClick={() => handlePostClick(post)}
              >
                <a.PostIMG bgPhoto={post.imgURL ? post.imgURL : basicIMG} />
                <a.ContentContainer>
                  <h2>{post.title}</h2>
                  <a.CreateAtText>{getTimeGap(post.createAt)}</a.CreateAtText>
                  <a.ContentText>
                    {post.content ? parsingHtml(post.content) : null}
                  </a.ContentText>
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
                        <span>{post.like?.length}</span>
                      </a.LikeIconContainer>
                      <p>
                        {post.price
                          ? post.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : 0}{' '}
                        원
                      </p>
                    </a.RightContainer>
                  </a.BottomContainer>
                </a.ContentContainer>
              </a.PostContainer>
            ))}
          </Fragment>
        ))}

        <a.PostContainer ref={observerElem}>
          <a.EndPostDiv>
            {isFetching || isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Scroll to load more posts'
              : 'No more posts'}
          </a.EndPostDiv>
        </a.PostContainer>
      </a.PostsContainer>
    </a.PageContainer>
  );
};

export default CategoryPage;
