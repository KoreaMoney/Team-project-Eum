import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  deletePosts,
  patchPosts,
  patchUsers,
  postOnSalePost,
} from '../../../api';
import {
  detailPostAtom,
  detailUserAtom,
  myOnSalePostsAtom,
  viewBuyerModalAtom,
} from '../../../atom';
import {
  customConfirm,
  customInfoAlert,
  customSuccessAlert,
  customWarningAlert,
} from '../../modal/CustomAlert';
import * as a from './PostInfoStyle';
import { v4 as uuidv4 } from 'uuid';
import { onSalePostType, postType } from '../../../types';

const PostInfo = () => {
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const { id, categoryName } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  // State
  const [likeData, setLikeData] = useState<{ like: any[] }>({ like: [] });
  const [isDrop, setIsDrop] = useState(false);
  const [isDone, setIsDone] = useState<boolean | undefined>(undefined);
  const postData = useRecoilValue(detailPostAtom);
  const userData = useRecoilValue(detailUserAtom);
  const myOnSale = useRecoilValue(myOnSalePostsAtom);
  const [isModalActive, setIsModalActive] = useRecoilState(viewBuyerModalAtom);

  const postCountCheck = postData?.[0]?.like?.includes(saveUser?.uid);


  useEffect(() => {
    setIsDone(postData?.[0]?.isDone)
  },[postData])

  /** 판매중 모달 */
  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  /**현재 URL 복사 */
  const linkCopy = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        customSuccessAlert('재능 공유가 되었습니다!');
      })
      .catch((error) => {
        console.error(`Could not copy URL to clipboard: ${error}`);
      });
  };

  /**글 삭제 mutate*/
  const { mutate: deletePost } = useMutation(
    (id: string | undefined) => deletePosts(id),
    {
      onSuccess: () => {
        navigate('/categorypage/all');
      },
    }
  );
  /**삭제버튼 클릭 */
  const onClickDeleteComment = (postId: string | undefined) => {
    customConfirm('정말 삭제하시겠습니까?', '내 글 삭제', '삭제', async () => {
      deletePost(postId);
    });
  };

  /**좋아요 업다운 mutate */
  const { mutate: updatePost } = useMutation(
    (newPosts: { like: string[] | undefined }) => patchPosts(id, newPosts),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', id]);
        setLikeData((prev: any) => ({
          ...prev,
          like: postCountCheck
            ? prev.like.filter((prev: any) => prev !== saveUser?.uid)
            : [...(prev.like || []), saveUser?.uid],
        }));
      },
      onError: (error) => {
        console.dir(error);
      },
    }
  );
  /**좋아요 버튼 클릭 */
  const postCounter = async () => {
    if (!saveUser) navigate('/signin');
    else {
      if (postCountCheck) {
        await updatePost({
          like: postData?.[0].like?.filter(
            (prev: any) => prev !== saveUser?.uid
          ),
        });
      } else {
        await updatePost({
          like: [...(postData?.[0].like || []), saveUser?.uid],
        });
      }
    }
  };

  /**바로 신청하기 버튼 클릭
   * user 데이터의 point가 price만큼 빠지고
   * mutate로 데이터를 저장합니다
   */
  const onClickApplyBuy = () => {
    customConfirm(
      '이음 재능을 연결하시겠습니까?',
      '연결을 누르시면 포인트가 차감됩니다.',
      '연결',
      () => {
        if (!saveUser) {
          navigate('/signin', { state: { from: location.pathname } });
          return;
        }

        /**null인 경우 0으로 초기화 */
        const point = Number(userData?.point) || 0;
        const price = Number(postData?.[0]?.price) || 0;

        /**구매자의 포인트에서 price만큼 뺀걸 구매자의 user에 업데이트 */
        if (point >= price) {
          updateUser({ point: point - price });
          const uuid = uuidv4();
          onSalePosts({
            id: uuid,
            postsId: id,
            buyerUid: saveUser.uid,
            buyerNickName: userData?.nickName,
            sellerUid: postData?.[0]?.sellerUid,
            sellerNickName: postData?.[0]?.nickName,
            title: postData?.[0]?.title,
            content: postData?.[0]?.content,
            imgURL: postData?.[0]?.imgURL,
            price: postData?.[0]?.price,
            category: postData?.[0]?.category,
            createdAt: Date.now(),
            isDone: false,
            isSellerCancel: false,
            isBuyerCancel: false,
            isCancel: false,
            cancelTime: 0,
            doneTime: 0,
            reviewDone: false,
          });
          setTimeout(() => {
            navigate(`/detail/${categoryName}/${id}/${userData?.id}/${uuid}`);
          }, 500);
        } else {
          customWarningAlert('포인트가 부족합니다.');
        }
      }
    );
  };
  /**구매자가 바로신청하기를 누르면 구매자의 포인트에서 price만큼 -해주는 mutation */
  const { mutate: updateUser } = useMutation(
    (newUser: { point: number | undefined }) =>
      patchUsers(saveUser?.uid, newUser),
    {
      onSuccess: () => queryClient.invalidateQueries(['user', saveUser?.uid]),
    }
  );
  /**onSalePosts 데이터 생성 */
  const { mutate: onSalePosts } = useMutation((newSalePosts: onSalePostType) =>
    postOnSalePost(newSalePosts)
  );



  /**판매중 <->거래완료 상태변경 */
  const { mutate: changeStatePost } = useMutation((newPost: postType) =>
    patchPosts(id, newPost)
  );
  /**판매중 클릭 */
  const onClickOnSaleButton = async () => {
    if (postData) {
      setIsDone(false);
      await changeStatePost({
        ...postData[0],
        isDone: false,
      });
    }
  };
  /**거래완료 클릭 */
  const onClickCompletedButton = async () => {
    if (postData) {
      setIsDone(true);
      await changeStatePost({
        ...postData[0],
        isDone: true,
      });
    }
  };

  /**드랍다운의 게시글 수정 클릭 함수 */
  const onClickMoveEditPage = () => {
    if (isDone) {
      customInfoAlert('거래가 완료된 글은 수정할 수 없습니다.');
    } else {
      navigate(`/editpage/${id}`);
    }
  }
  return (
    <a.PostInfoWrapper>
      <a.InfoTopContainer>
        <a.InfoTopLeftContainer>
          <p>
            {postData?.[0]?.category === 'all'
              ? '전체'
              : postData?.[0]?.category === 'study'
              ? '공부'
              : postData?.[0]?.category === 'play'
              ? '놀이'
              : postData?.[0]?.category === 'advice'
              ? '상담'
              : postData?.[0]?.category === 'etc'
              ? '기타'
              : '전체'}
          </p>
        </a.InfoTopLeftContainer>
        <a.InfoTopRightContainer>
          {postCountCheck ? (
            // 상단 하트개수 나오는 곳
            <a.LikeIconLeftContainer>
              <a.LikeHeartIcon />
              <a.LikeLikeLength>{postData?.[0]?.like?.length}</a.LikeLikeLength>
            </a.LikeIconLeftContainer>
          ) : (
            <a.IconLeftContainer>
              <a.HeartIcon />
              <a.LikeLength>{postData?.[0]?.like?.length}</a.LikeLength>
            </a.IconLeftContainer>
          )}
          <a.IconRightContainer>
            <a.ShareIcon onClick={linkCopy} />
          </a.IconRightContainer>
        </a.InfoTopRightContainer>
      </a.InfoTopContainer>
      <a.TextContainer>
        <a.TitleText>{postData?.[0]?.title}</a.TitleText>
        {saveUser?.uid === postData?.[0]?.sellerUid && (
          // 판매자만 보이는 드랍다운 케밥 버튼
          <a.DropDownContainer>
            <a.KebobIcon onClick={() => setIsDrop(!isDrop)} />
            {isDrop && (
              <a.DropDownBox>
                <a.DropDownButton
                  onClick={onClickMoveEditPage}
                  aria-label="수정"
                >
                  게시글 수정
                </a.DropDownButton>
                <a.DropDownButton
                  onClick={() => onClickDeleteComment(postData?.[0].id)}
                >
                  삭제
                </a.DropDownButton>
              </a.DropDownBox>
            )}
          </a.DropDownContainer>
        )}
      </a.TextContainer>
      <a.PostNickName>{postData?.[0]?.nickName}</a.PostNickName>

      <a.PostPrice>
        {postData?.[0]?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} P
      </a.PostPrice>

      {saveUser?.uid === postData?.[0]?.sellerUid ? (
        // 판매자일 때
        <>
          {isDone ? (
            <>
              <a.LikeContainer>
                <a.NotViewBuyerButton aria-label="구매자명단">
                  구매자 ({myOnSale?.length === 0 ? '0' : myOnSale?.length})
                </a.NotViewBuyerButton>
              </a.LikeContainer>
              <a.CompletedBTContainer>
                <a.NoStateButton onClick={onClickOnSaleButton}>
                  판매중
                </a.NoStateButton>
                <a.StateButton onClick={onClickCompletedButton}>
                  거래 완료
                </a.StateButton>
              </a.CompletedBTContainer>
            </>
          ) : (
            <>
              <a.LikeContainer>
                <a.ViewBuyerButton
                  onClick={onClickToggleModal}
                  aria-label="구매자명단"
                >
                  구매자 ({myOnSale?.length === 0 ? '0' : myOnSale?.length})
                </a.ViewBuyerButton>
              </a.LikeContainer>
              <a.CompletedBTContainer>
                <a.StateButton onClick={onClickOnSaleButton}>
                  판매중
                </a.StateButton>
                <a.NoStateButton onClick={onClickCompletedButton}>
                  거래 완료
                </a.NoStateButton>
              </a.CompletedBTContainer>
            </>
          )}
        </>
      ) : (
        // 구매자일 때
        <a.LikeContainer>
          {postCountCheck ? (
            // 좋아요를 눌렀을 때
            <a.LikeButtonContainer
              onClick={postCounter}
              aria-label="좋아요 더하기"
            >
              <a.LikeIcon />
            </a.LikeButtonContainer>
          ) : (
            // 좋아요를 안눌렀을 때
            <a.NoLikeButtonContainer
              onClick={postCounter}
              aria-label="좋아요 빼기"
            >
              <a.NoLikeIcon />
            </a.NoLikeButtonContainer>
          )}
          <a.LikeSubmitButton
            onClick={onClickApplyBuy}
            aria-label="바로 구매하기"
          >
            바로 구매하기
          </a.LikeSubmitButton>
        </a.LikeContainer>
      )}
    </a.PostInfoWrapper>
  );
};

export default PostInfo;
