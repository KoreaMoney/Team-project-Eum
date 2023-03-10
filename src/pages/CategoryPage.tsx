import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { sortAtom } from '../atom';
import { postType } from '../types';

import * as a from '../styles/styledComponent/category';
import axios from 'axios';
import CategoryIntros from '../components/categoryHome/CategoryIntros';
import Post from '../components/categoryHome/Post';
import Loader from '../components/etc/Loader';
import ErrorETC from '../components/error/ErrorETC';

/** 전체, 놀이 등 카테고리를 클릭하면 이동되는 페이지입니다.
 * 어떤 DATA의 URL이 들어가는 먼저 넣기
 * 무한 스크롤 구현하기
 */
const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryName, select, word } = useParams();
  const PAGE_SIZE = 6;

  const [sort, setSort] = useRecoilState(sortAtom);
  const observerElem = useRef<HTMLDivElement | null>(null);

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
        _sort: sort === '최신순' ? 'createAt' : 'like.length', // createAt 필드를 기준으로 정렬
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

  //카테고리 무한 스크롤
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery(
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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorETC />;
  }
  return (
    <a.PageContainer>
      <CategoryIntros categoryName={categoryName} />
      <a.PostsContainer>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((post: postType) => (
              <Post post={post} onClick={handlePostClick} key={post.id} />
            ))}
          </Fragment>
        ))}

        <a.PostContainer ref={observerElem}></a.PostContainer>
        {isFetching || isFetchingNextPage ? <Loader /> : null}
      </a.PostsContainer>
    </a.PageContainer>
  );
};

export default CategoryPage;
