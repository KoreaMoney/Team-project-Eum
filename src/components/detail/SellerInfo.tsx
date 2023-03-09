import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { viewKakaoModalAtom } from '../../atom';
import { customWarningAlert } from '../modal/CustomAlert';
import {
  getOnSalePostBuyer,
  getPostsId,
  getSellerPosts,
  getUsers,
} from '../../api';

import * as a from '../../styles/styledComponent/detail';
import basicIMG from '../../styles/basicIMG.webp';
import c_cheap from '../../styles/badge/choice/c_cheap.webp';
import c_donation from '../../styles/badge/choice/c_donation.webp';
import c_fast from '../../styles/badge/choice/c_fast.webp';
import c_manner from '../../styles/badge/choice/c_manner.webp';
import c_service from '../../styles/badge/choice/c_service.webp';
import c_time from '../../styles/badge/choice/c_time.webp';
import basicLock from '../../styles/badge/basicLock.webp';
import styled from 'styled-components';
import KakaoModal from '../modal/KakaoModal';

const SellerInfo = () => {
  const { postId, id } = useParams();
  const identifier = id ? id : postId;
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const images = [c_time, c_manner, c_cheap, c_fast, c_service, c_donation];
  const navigate = useNavigate();
  const [badgeLength, setBadgeLength] = useState(0);
  const [isModalActive, setIsModalActive] = useRecoilState(viewKakaoModalAtom);

  const { data: post } = useQuery(
    ['post', identifier],
    () => getPostsId(identifier),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
    }
  );

  /**판매중인 글 */
  const { data: sellerPosts } = useQuery(
    ['sellerPost', post?.[0].sellerUid],
    () => getSellerPosts(post?.[0].sellerUid),
    {
      staleTime: Infinity,
    }
  );

  const { data: onSalePostBuyerData } = useQuery(
    ['onSalePosts', saveUser?.uid],
    () => getOnSalePostBuyer(saveUser?.uid)
  );
  const isPostBuyer = onSalePostBuyerData?.filter((list: any) => {
    return list?.postsId === post?.[0]?.id;
  });

  /**판매자의 프로필이미지를 위해 데이터 가져오기 */
  const { data: seller } = useQuery(
    ['user', post?.[0].sellerUid],
    () => getUsers(post?.[0].sellerUid),
    {
      enabled: Boolean(post?.[0].sellerUid), // post?.[0].sellerUid가 존재할 때만 쿼리를 시작
      staleTime: Infinity,
    }
  );

  /**배지 개수 구하기 */
  useEffect(() => {
    const time = seller?.time >= 10 ? true : false;
    const cheap = seller?.cheap >= 10 ? true : false;
    const fast = seller?.fast >= 10 ? true : false;
    const service = seller?.service >= 10 ? true : false;
    const donation = seller?.donation >= 10 ? true : false;
    const result = [time, cheap, fast, service, donation];
    const trueValues = result.filter((value) => value === true);
    setBadgeLength(trueValues.length);
  }, [seller]);

  /**배지 이미지 정하기 */
  let userBadge;
  switch (seller?.repBadge) {
    case 'time':
      userBadge = images[0];
      break;
    case 'manner':
      userBadge = images[1];
      break;
    case 'cheap':
      userBadge = images[2];
      break;
    case 'fast':
      userBadge = images[3];
      break;
    case 'service':
      userBadge = images[4];
      break;
    case 'donation':
      userBadge = images[5];
      break;
  }
  return (
    <a.SellerInfoContainer>
      <a.ProfileContainer>
        <a.Profiles>
          <a.ProfileIMG
            profileIMG={seller?.profileImg ? seller?.profileImg : basicIMG}
            aria-label="프로필 이미지"
            onClick={() => navigate(`/userprofile/${seller?.id}`)}
          />
        </a.Profiles>
        <a.Profiles>
          <a.NickName>
            <p>{seller?.nickName}</p>
          </a.NickName>
        </a.Profiles>
        <a.Profiles
          style={{
            borderLeft: '1px solid #C2C1C1',
          }}
        >
          {seller?.repBadge ? (
            <BadgeImg imageUrl={userBadge} />
          ) : (
            <BasicBadgeImg img={basicLock} />
          )}
        </a.Profiles>
      </a.ProfileContainer>

      <a.ProfileInfoContainer>
        <a.ProfileInfos>배지 {badgeLength}개</a.ProfileInfos>
        <a.ProfileInfos aria-label="매칭 상품">
          매칭 상품 {sellerPosts?.length ? sellerPosts?.length : '0'}개
        </a.ProfileInfos>
        <a.ProfileInfos aria-label="받은 후기" style={{ borderRight: 'none' }}>
          매칭 후기 {seller?.commentsCount ? seller?.commentsCount : '0'}개
        </a.ProfileInfos>
      </a.ProfileInfoContainer>
      {isPostBuyer?.length > 0 ? (
        <>
          <a.KakaoButton onClick={() => setIsModalActive(true)}>
            카카오톡으로 문의하기
          </a.KakaoButton>
          <KakaoModal />
        </>
      ) : (
        <a.KakaoButton
          onClick={() =>
            customWarningAlert('재능 구매자에게만\n제공되는 서비스입니다.')
          }
          aria-label="안내 알림"
        >
          카카오톡으로 문의하기
        </a.KakaoButton>
      )}
    </a.SellerInfoContainer>
  );
};

export default SellerInfo;
const BadgeImg = styled.div<{ imageUrl: string | undefined }>`
  width: 112px;
  height: 112px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
`;

const BasicBadgeImg = styled.div<{ img: string }>`
  width: 96px;
  height: 96px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
`;
