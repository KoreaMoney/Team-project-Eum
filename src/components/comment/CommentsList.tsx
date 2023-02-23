import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../../firebase/Firebase';
import { commentType } from '../../types';
import { customConfirm } from '../modal/CustomAlert';

const CommentsList = () => {
  const observerElem = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const PAGE_SIZE = 6;
const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const fetchComments = async (page = 0) => {
    const url = `${process.env.REACT_APP_JSON}/comments?postId=${id}`;

    const response = await axios.get(url, {
      params: {
        _page: page,
        _limit: PAGE_SIZE,
      },
    });
    console.log('response.data: ', response.data);
    return response.data;
  };
  const { data: user } = useQuery(
    ['user', saveUser?.uid],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_JSON}/users/${saveUser?.uid}`
      );
      return response.data;
    },
 
  );
  console.log( 'user: ' ,user);
  
  const {
    data,
    isSuccess,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['comments', id],
    ({ pageParam = 0 }) => fetchComments(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.length !== 0 ? nextPage : undefined;
      },
    }
  );

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

  // 댓글을 삭제하는 코드.
  // onClickDeleteComment 함수에서 commentId를 받아와 클릭한 댓글만 삭제될 수 있도록 합니다.
  const { mutate: deleteComment } = useMutation(
    (commentId: string) =>
      axios.delete(`${process.env.REACT_APP_JSON}/comments/${commentId}`),
    {
      // 댓글을 성공적으로 삭제했다면 쿼리무효화를 통해 ui에 바로 업뎃될 수 있도록 해줍니다.
      onSuccess: () => {
        queryClient.invalidateQueries(['comments']);
      },
    }
  );
  const onClickDeleteComment = async (commentId: string) => {
    customConfirm('정말 삭제하시겠습니까?', '댓글 삭제', '삭제', async () => {
      await deleteComment(commentId);
    });
  };

  // 댓글 작성 시간을 n분전 으로 출력해주는 함수
  // 7일 이상이 된 댓글은 yyyy-mm-dd hh:mm 형식으로 출력됩니다.
  const getTimegap = (posting: number) => {
    const msgap = Date.now() - posting;
    const minutegap = Math.floor(msgap / 60000);
    const hourgap = Math.floor(msgap / 3600000);
    if (msgap < 0) {
      return '방금 전';
    }
    if (hourgap > 24) {
      const time = new Date(posting);
      const timegap =
        time.toJSON().substring(0, 10) + ' ' + time.toJSON().substring(11, 16);
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

  console.log('data: ', data);

  return (
    <div>
      <div></div>
      <CommentsContainer>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((comment: commentType) => (
              <CommentContainer key={comment.id}>
                <LeftContainer>
                  <ProfileIMG profileIMG={comment.profileImg} />
                  <NickName>{comment.writerNickName}</NickName>
                  <CommentContent>{comment.content}</CommentContent>
                </LeftContainer>
                <RightContainer>
                  <CreateAt>{getTimegap(comment.createAt)}</CreateAt>
                  <DeleteButton
                    onClick={() => onClickDeleteComment(comment.id)}
                  >
                    삭제
                  </DeleteButton>
                </RightContainer>
              </CommentContainer>
            ))}
          </Fragment>
        ))}

        <CommentContainer ref={observerElem}>
          {isFetching || isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Scroll to load more posts'
            : 'No more posts'}
        </CommentContainer>
      </CommentsContainer>
    </div>
  );
};

export default CommentsList;
const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const CommentContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #ffda18;
  padding: 0.5rem 0;
`;

const ProfileIMG = styled.div<{ profileIMG: string | undefined | null }>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const NickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.body16};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  margin: 0 2rem 0 0.5rem;
`;

const CommentContent = styled.p`
  font-size: ${(props) => props.theme.fontSize.body16};
`;

const CreateAt = styled.p`
  font-size: ${(props) => props.theme.fontSize.label12};
  color: ${(props) => props.theme.colors.gray20};
`;

const DeleteButton = styled.button`
  font-size: ${(props) => props.theme.fontSize.body16};
  border: none;
  background-color: #ffda18;
  width: 3rem;
  height: 35px;
  &:hover {
    cursor: pointer;
  }
`;
