import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getPostsId, getUsers } from '../../api';
import {
  onSalePostAtom,
  userProfileAtom,
  viewKakaoModalAtom,
} from '../../atom';
import { CustomModal } from './CustomModal';
import styled from 'styled-components';
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { dbService } from '../../firebase/Firebase';
import { customWarningAlert } from './CustomAlert';
import { Chat } from '../../types';

const KakaoModal = () => {
  const { postId } = useParams();
  const location = useLocation();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [isModalActive, setIsModalActive] = useRecoilState(viewKakaoModalAtom);
  const [chatContent, setChatContent] = useState('');
  const [chat, setChat] = useState<Chat[] | null>(null);
  const onSalePost = useRecoilValue(onSalePostAtom);
  const [userNick, setUserNick] = useState<string | null | undefined>('');
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = isModalActive ? 'hidden' : 'auto';
      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [isModalActive]);

  const { data: post } = useQuery(['post', postId], () => getPostsId(postId), {
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  });

  const { data: seller } = useQuery(
    ['user', post?.[0]?.sellerUid],
    () => getUsers(post?.[0]?.sellerUid),
    {
      enabled: Boolean(post?.[0]?.sellerUid), // post?.[0].sellerUid가 존재할 때만 쿼리를 시작
      refetchOnMount: 'always',
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: 'always',
    }
  );
  const isDetailPage = location.pathname === '/detail';
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
  /** 채팅 관련 */
  const salePostId = onSalePost?.[0]?.id;
  const sellerNickName = onSalePost?.[0]?.sellerNickName;
  const buyerNickName = onSalePost?.[0]?.buyerNickName;
console.log( 'salePostId: ' ,salePostId);

  /**전송 버튼 클릭 */
  const onClickAddChatContents = async () => {
    if (salePostId) {
      if (saveUser.uid === onSalePost?.[0]?.sellerUid) {
        setUserNick(sellerNickName);
      } else {
        setUserNick(buyerNickName);
      }

      if (chatContent) {
        await updateDoc(doc(dbService, 'chat', salePostId), {
          chatContent: arrayUnion({
            message: chatContent,
            nickName: userNick,
            createdAt: Date.now(),
          }),
        });
      } else {
        customWarningAlert('내용을 입력해주세요');
      }
      setChatContent('');
    }
  };


    

  const getChat = () => {
    const q = query(
      collection(dbService, 'chat'),
      where('id', '==', salePostId)
    );
    onSnapshot(q, (snapshot) => {
      const newChats = snapshot.docs.map((doc) => {
        const newChat = {
          id: doc.id,
          chatContent: [],
          ...doc.data(),
        };
        console.log('newChat: ', newChat);

        return newChat;
      });
      setChat(newChats);
    });
  };
  console.log('chat: ', chat);

  useEffect(() => {
    getChat();
  }, [salePostId]);

  return (
    <>
      {isModalActive ? (
        <CustomModal
          modal={isModalActive}
          setModal={setIsModalActive}
          width="600"
          height="1000"
          overflow="hidden"
          element={
            <Container>
              <Title>문의하기</Title>
              <KakaoInfoContainer>
                <KakaoInfo>
                  하단에 적힌<span> 카카오톡 ID</span>로 연락해서
                </KakaoInfo>
                <KakaoInfo>판매자에게 궁금한 점을 물어보세요!</KakaoInfo>
              </KakaoInfoContainer>
              <Seller>
                {seller?.nickName}
                <span>님의</span> 카카오톡 ID 입니다.
              </Seller>
              <KakaoIdContainer>
                <KakaoIdTitle>카카오톡ID</KakaoIdTitle>
                <KakaoId>
                  {seller?.kakaoId
                    ? seller?.kakaoId
                    : 'ID가 등록되지 않았습니다.'}
                </KakaoId>
              </KakaoIdContainer>
              <div>
                여기서부터 채팅창
                <div style={{ overflow: 'scroll', height: 200 }}>
                  {chat?.[0]?.chatContent.map((prev) => {
                    return <p key={prev.createdAt}>{prev.message}</p>;
                  })}
                </div>
                <input
                  type="text"
                  value={chatContent}
                  onChange={(e) => setChatContent(e.target.value)}
                />
                <button onClick={onClickAddChatContents}>전송</button>
              </div>
            </Container>
          }
        />
      ) : (
        ''
      )}
    </>
  );
};

export default KakaoModal;

const Container = styled.div`
  width: 500px;
  height: 251px;
  margin: 80px;
  text-align: center;
  color: ${(props) => props.theme.colors.black};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
`;

const KakaoInfoContainer = styled.div`
  width: 100%;
  height: 51px;
  margin: 32px 0;
`;

const KakaoInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.gray20};
  margin-bottom: 8px;

  span {
    font-size: ${(props) => props.theme.fontSize.title18};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    line-height: ${(props) => props.theme.lineHeight.title18};
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;

const Seller = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title16};
  margin-bottom: 24px;

  span {
    font-weight: ${(props) => props.theme.fontWeight.regular};
  }
`;

const KakaoIdContainer = styled.div`
  width: 100%;
  height: 56px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
  padding: 16px 0;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
`;

const KakaoIdTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.gray30};
`;

const KakaoId = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.black};
`;
