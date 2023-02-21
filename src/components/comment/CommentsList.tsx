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
import { auth } from '../../firebase/Firebase';
import { commentType } from '../../types';
import { customConfirm } from '../modal/CustomAlert';

const CommentsList = () => {
  const observerElem = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const PAGE_SIZE = 6;
  const fetchComments = async (page = 0) => {
    const url = `http://localhost:4000/comments?postId=${id}`;

    const response = await axios.get(url, {
      params: {
        _page: page,
        _limit: PAGE_SIZE,
      },
    });
    console.log('response.data: ', response.data);
    return response.data;
  };

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
      axios.delete(`http://localhost:4000/comments/${commentId}`),
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
      <div>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((comment: commentType) => (
              <div key={comment.id}>
                <p>작성자 :{comment.writerNickName}</p>
                <p>내용 :{comment.content}</p>
                <p>작성시간 :{comment.createAt}</p>
                <button>삭제</button>
              </div>
            ))}
          </Fragment>
        ))}

        <div ref={observerElem}>
          {isFetching || isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Scroll to load more posts'
            : 'No more posts'}
        </div>
      </div>
    </div>
  );
};
//     <div>
//       {isSuccess &&
//         data.pages.map((page, i) => (
//           <React.Fragment key={i}>
//             {page.map((comment: commentType) => (
//               <div key={comment.id}>
//                 <p>{comment.content}</p>
//                 <p>{getTimegap(comment.createAt)}</p>
//                 <p>{comment.writerNickName}</p>
//                 <button onClick={() => onClickDeleteComment(comment.id)}>삭제</button>
//               </div>
//             ))}
//           </React.Fragment>
//         ))}
      
//       {isFetching && <div>Loading...</div>}
//       <div ref={observerElem}></div>
//     </div>
//   );
// };

export default CommentsList;
