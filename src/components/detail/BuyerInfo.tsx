import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSellerPosts, getUsers } from '../../api';

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

const SellerInfo = () => {
  const images = [c_time, c_manner, c_cheap, c_fast, c_service, c_donation];
  const { buyerId } = useParams();
  const [badgeLength, setBadgeLength] = useState(0);
  const navigate = useNavigate();

  /**판매중인 글 */
  const { data: sellerPosts } = useQuery(
    ['sellerPost', buyerId],
    () => getSellerPosts(buyerId),
    {
      staleTime: Infinity,
    }
  );

  /**구매자 정보 가져오기 */
  const { data: buyer } = useQuery(['user', buyerId], () => getUsers(buyerId), {
    staleTime: Infinity,
  });

  /**배지 개수 구하기 */
  useEffect(() => {
    const time = buyer?.time >= 10 ? true : false;
    const cheap = buyer?.cheap >= 10 ? true : false;
    const fast = buyer?.fast >= 10 ? true : false;
    const service = buyer?.service >= 10 ? true : false;
    const donation = buyer?.donation >= 10 ? true : false;
    const result = [time, cheap, fast, service, donation];

    const trueValues = result.filter((value) => value === true);
    setBadgeLength(trueValues.length);
  }, [buyer]);

  /**배지 이미지 정하기 */
  let userBadge;
  switch (buyer?.repBadge) {
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
            profileIMG={buyer?.profileImg ? buyer?.profileImg : basicIMG}
            aria-label="프로필 이미지"
            onClick={() => navigate(`/userprofile/${buyer?.id}`)}
          />
        </a.Profiles>
        <a.Profiles>
          <a.NickName>
            <p>{buyer?.nickName}</p>
          </a.NickName>
        </a.Profiles>
        <a.Profiles
          style={{
            borderLeft: '1px solid #C2C1C1',
          }}
        >
          {buyer?.repBadge ? (
            <BadgeImg imageUrl={userBadge} />
          ) : (
            <BasicBadgeImg img={basicLock} />
          )}
        </a.Profiles>
      </a.ProfileContainer>

      <a.ProfileInfoContainer>
        <a.ProfileInfos>배지 {badgeLength}개</a.ProfileInfos>
        <a.ProfileInfos aria-label="매칭상품">
          매칭상품 {sellerPosts?.length ? sellerPosts?.length : '0'}개
        </a.ProfileInfos>
        <a.ProfileInfos aria-label="받은 후기" style={{ borderRight: 'none' }}>
          후기 {buyer?.commentsCount ? buyer?.commentsCount : '0'}개
        </a.ProfileInfos>
      </a.ProfileInfoContainer>
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
