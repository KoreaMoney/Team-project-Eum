import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getPostsId, getUsers } from '../../api';
import imageCompression from 'browser-image-compression';
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
import { auth, dbService, storageService } from '../../firebase/Firebase';
import { customWarningAlert } from './CustomAlert';
import { Chat } from '../../types';
import camera from '../../styles/camera.png';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const KakaoModal = () => {
  const { postId } = useParams();
  const location = useLocation();
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const messagesEndRef = useRef<HTMLDivElement>(document.createElement('div'));

  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [isModalActive, setIsModalActive] = useRecoilState(viewKakaoModalAtom);
  const imgRef = useRef<HTMLInputElement>(null);
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
  const getTimeGap = (posting: number | undefined) => {
    if (posting) {
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
    }
  };
  /** 여기서부터 채팅 관련 */
  const salePostId = onSalePost?.[0]?.id;

  useEffect(() => {
    setUserNick(
      saveUser.uid === onSalePost?.[0]?.sellerUid
        ? onSalePost?.[0].sellerNickName
        : onSalePost?.[0].buyerNickName
    );
  }, [onSalePost]);

  /**전송 버튼 클릭 */
  const onClickAddChatContents = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (salePostId) {
      //   if (saveUser.uid === onSalePost?.[0]?.sellerUid) {
      //     setUserNick(sellerNickName);
      //   } else {
      //     setUserNick(buyerNickName);
      //   }

      if (chatContent) {
        await updateDoc(doc(dbService, 'chat', salePostId), {
          chatContent: arrayUnion({
            message: chatContent,
            uid: saveUser.uid,
            nickName: userNick,
            createdAt: Date.now(),
          }),
        });
        setChatContent('');
      } else {
        customWarningAlert('내용을 입력해주세요');
      }
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
        return newChat;
      });
      setChat(newChats);
    });
  };
  const saveImgFile = async () => {
    if (!imgRef.current?.files || imgRef.current.files.length === 0) {
      return;
    }

    const file = imgRef.current.files[0];

    const options = {
      maxSizeMB: 0.15,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      // 압축 결과
      const compressedFile = await imageCompression(file, options).then(
        (res) => {
          return res;
        }
      );
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const resultImg = reader.result;
        shortenUrl(resultImg as string);
      };
    } catch (error) {
      console.dir(error);
    }
  };

  // 파이어 스토리지를 이용해 base64 기반 이미지 코드를 짧은 url로 변경
  const shortenUrl = async (img: string) => {
    const imgRef = ref(storageService, `${auth.currentUser?.uid}${Date.now()}`);
    const imgDataUrl = img;
    let downloadUrl;
    if (imgDataUrl) {
      const response = await uploadString(imgRef, imgDataUrl, 'data_url');
      downloadUrl = await getDownloadURL(response.ref);
      if (salePostId) {
        await updateDoc(doc(dbService, 'chat', salePostId), {
          chatContent: arrayUnion({
            imgUrl: downloadUrl,
            uid: saveUser.uid,
            nickName: userNick,
            createdAt: Date.now(),
          }),
        });
      }
    }
  };

  useEffect(() => {
    getChat();
  }, [salePostId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [isModalActive]);

  return (
    <>
      {isModalActive ? (
        <CustomModal
          modal={isModalActive}
          setModal={setIsModalActive}
          width="872"
          height="750"
          overflow="hidden"
          element={
            <Container onSubmit={onClickAddChatContents}>
              <Title>채팅하기</Title>
              <ScrollContainer>
                <ChatContainer>
                  {chat?.[0]?.chatContent.map((prev) => {
                    return (
                      <>
                        {prev.uid === saveUser.uid ? (
                          <>
                            <MyDiv>
                              <MyChatContainer key={prev.createdAt}>
                                <span>{prev.nickName}</span>

                                {prev.imgUrl ? (
                                  <ImgBox
                                    img={prev.imgUrl}
                                    onClick={() => {
                                      window.open(prev.imgUrl);
                                    }}
                                  />
                                ) : null}

                                {prev.message ? <p>{prev.message}</p> : null}
                              </MyChatContainer>
                              <CreatedAtContainer>
                                <CreatedAt>
                                  {getTimeGap(prev.createdAt)}
                                </CreatedAt>
                              </CreatedAtContainer>
                            </MyDiv>
                          </>
                        ) : (
                          <YouDiv>
                            <YouChatContainer key={prev.createdAt}>
                              <span>{prev.nickName}</span>
                              {prev.imgUrl ? (
                                <ImgBox
                                  img={prev.imgUrl}
                                  onClick={() => {
                                    window.open(prev.imgUrl);
                                  }}
                                />
                              ) : null}

                              {prev.message ? <p>{prev.message}</p> : null}
                            </YouChatContainer>
                            <CreatedAtContainer>
                              <CreatedAt>
                                {getTimeGap(prev.createdAt)}
                              </CreatedAt>
                            </CreatedAtContainer>
                          </YouDiv>
                        )}
                      </>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </ChatContainer>
              </ScrollContainer>
              <ChatInputContainer>
                <label htmlFor="changeImg">
                  <PhotoIcon>
                    <input
                      hidden
                      type="file"
                      id="changeImg"
                      onChange={saveImgFile}
                      ref={imgRef}
                      name="profile_img"
                      accept="image/*"
                    />
                  </PhotoIcon>
                </label>

                <ChatInput
                  type="text"
                  value={chatContent}
                  onChange={(e) => setChatContent(e.target.value)}
                  placeholder="메세지를 입력해주세요."
                  maxLength={150}
                />
              </ChatInputContainer>
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

const Container = styled.form`
  width: 640px;
  height: 600px;
  margin: 80px;
  text-align: center;
  color: ${(props) => props.theme.colors.black};
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
  margin-bottom: 40px;
`;

const MyDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: flex-end;
  height: 100%;
`;

const YouDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CreatedAtContainer = styled.div`
  display: flex;
  justify-content: right;
`;
const CreatedAt = styled.p`
  font-size: 12px;
  font-weight: ${(props) => props.theme.fontWeight.regular};
  color: ${(props) => props.theme.colors.gray30};
  padding: 5px;
  display: flex;
`;
const ChatContainer = styled.div`
  height: 439px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 95%;
`;

const MyChatContainer = styled.div`
  min-height: 56px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 80%;
  span {
    font-size: ${(props) => props.theme.fontSize.title14};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: 17.76px;
    padding: 5px 15px;
    color: ${(props) => props.theme.colors.orange02Main};
  }
  p {
    font-size: ${(props) => props.theme.fontSize.title16};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: 23.68px;
    word-break: break-all;
    padding: 10px 24px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.colors.orange00};
    filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.25));
  }
`;

const YouChatContainer = styled.div`
  min-height: 56px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
  span {
    font-size: ${(props) => props.theme.fontSize.title14};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: 17.76px;
    padding: 5px 15px;
    color: ${(props) => props.theme.colors.gray30};
  }
  p {
    font-size: ${(props) => props.theme.fontSize.title16};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: 23.68px;
    word-break: break-all;
    padding: 10px 24px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.colors.gray10};
    filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.4));
  }
`;

const ScrollContainer = styled.div`
  height: 639px;
  width: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.orange02Main};
    border-radius: 10px;
    width: 5px;
  }

  &::-webkit-scrollbar-track-piece {
    background-color: #f1f1f1;
  }
`;

const ChatInputContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
`;

const ChatInput = styled.input`
  width: 90%;
  height: 40px;
  border: 1px solid ${(props) => props.theme.colors.orange02Main};
  border-radius: 50px;
  padding: 11px 49px;
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.black};
  &::placeholder {
    font-size: ${(props) => props.theme.fontSize.title16};
    font-weight: ${(props) => props.theme.fontWeight.regular};
    line-height: ${(props) => props.theme.lineHeight.title16};
  }

  &:focus {
    outline: none;
  }
`;

const PhotoIcon = styled.div`
  background-image: url(${camera});
  width: 40px;
  height: 40px;
  background-size: cover;
  background-position: center center;
  margin-left: 10px;
`;

export const ImgBox = styled.div<{ img: string }>`
  width: 380px;
  height: 380px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
  position: relative;
`;
