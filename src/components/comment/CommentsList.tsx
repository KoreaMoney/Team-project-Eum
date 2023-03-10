import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { commentType } from '../../types';
import { getPostsId, getUsers, patchUsers } from '../../api';

import axios from 'axios';
import styled from 'styled-components';
import Loader from '../etc/Loader';

/**순서
 * 1. 저장된 유저 정보 가져오기
 * 2. 유저의 UID값 가져오기
 * 3. 무한 스크롤 구현하기
 */
const CommentsList = () => {
  const observerElem = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const PAGE_SIZE = 6;

  const fetchComments = async (page = 0) => {
    const url = `${process.env.REACT_APP_JSON}/comments?postId=${id}`;
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

  //무한 스크롤 진행하기
  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['comments', id],
      ({ pageParam = 0 }) => fetchComments(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return lastPage.length !== 0 ? nextPage : undefined;
        },
      }
    );

  //페이지 관찰 observer넣기
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

  //판매자 uid를 post를 이용해 get하기
  const { data: post } = useQuery(['post', id], () => getPostsId(id), {
    staleTime: Infinity,
  });

  //커맨트 삭제 시 판매자 커맨트 카운트 -1을 위한 판매자 정보 get하기
  const { data: sellerUser } = useQuery(
    ['user', post?.[0]?.sellerUid],
    () => getUsers(post?.[0]?.sellerUid),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
    }
  );

  //  comment가 달리면 판매자 user data의 commentsCount가 +1이 된다.
  const { mutate } = useMutation(
    (newUser: { commentsCount: number }) =>
      patchUsers(post?.[0].sellerUid, newUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', sellerUser?.id]);
      },
    }
  );

  /**댓글 작성 시간을 n분전 으로 출력해주는 함수
   * 7일 이상이 된 댓글은 yyyy-mm-dd hh:mm 형식으로 출력
   */
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

  return (
    <div>
      <CommentsContainer>
        <CommentTitleText>매칭 후기</CommentTitleText>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((comment: commentType) => (
              <CommentContainer key={comment.id}>
                <TopContainer>
                  <NickName>{comment.writerNickName}</NickName>
                  <CreateAt>{getTimeGap(comment.createAt)}</CreateAt>
                </TopContainer>
                <RightContainer>
                  <CommentContent>{comment.content}</CommentContent>
                </RightContainer>
              </CommentContainer>
            ))}
          </Fragment>
        ))}

        <CommentContainer
          style={{ border: 'none', height: '0' }}
          ref={observerElem}
        >
          {isFetching || isFetchingNextPage ? <Loader /> : null}
        </CommentContainer>
      </CommentsContainer>
    </div>
  );
};

export default CommentsList;
const CommentTitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  padding-bottom: 28px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 728px;
  margin-bottom: 240px;
  margin-top: 60px;
`;

const CommentContainer = styled.div`
  height: 135px;
  display: flex;
  align-items: left;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

const TopContainer = styled.div`
  display: flex;
`;

const NickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray50};
  padding-right: 16px;
  border-right: 1px solid ${(props) => props.theme.colors.gray20};
  margin-bottom: 16px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentContent = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray30};
`;

const CreateAt = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray30};
  margin-left: 16px;
`;
