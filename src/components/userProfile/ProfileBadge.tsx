import { useEffect } from 'react';
import styled from 'styled-components';
import c_cheap from '../../styles/badge/choice/c_cheap.webp';
import lock_cheap from '../../styles/badge/lock/lock_cheap.webp';
import nc_cheap from '../../styles/badge/notChoice/nc_cheap.webp';

import c_donation from '../../styles/badge/choice/c_donation.webp';
import lock_donation from '../../styles/badge/lock/lock_donation.webp';
import nc_donation from '../../styles/badge/notChoice/nc_donation.webp';

import c_fast from '../../styles/badge/choice/c_fast.webp';
import lock_fast from '../../styles/badge/lock/lock_fast.webp';
import nc_fast from '../../styles/badge/notChoice/nc_fast.webp';

import c_manner from '../../styles/badge/choice/c_manner.webp';
import lock_manner from '../../styles/badge/lock/lock_manner.webp';
import nc_manner from '../../styles/badge/notChoice/nc_manner.webp';

import c_service from '../../styles/badge/choice/c_service.webp';
import lock_service from '../../styles/badge/lock/lock_service.webp';
import nc_service from '../../styles/badge/notChoice/nc_service.webp';

import c_time from '../../styles/badge/choice/c_time.webp';
import lock_time from '../../styles/badge/lock/lock_time.webp';
import nc_time from '../../styles/badge/notChoice/nc_time.webp';

import { useRecoilState, useRecoilValue } from 'recoil';
import {
  userBadgeLengthAtom,
  userProfileAtom,
} from '../../atom';

const ProfileBadge = () => {
  const userProfile = useRecoilValue(userProfileAtom);
  const [badgeLength, setBadgeLength] = useRecoilState(userBadgeLengthAtom);

  const images = [
    [c_time, lock_time, nc_time],
    [c_manner, lock_manner, nc_manner],
    [c_cheap, lock_cheap, nc_cheap],
    [c_fast, lock_fast, nc_fast],
    [c_service, lock_service, nc_service],
    [c_donation, lock_donation, nc_donation],
  ];

  useEffect(() => {
    const time = userProfile?.time;
    const cheap = userProfile?.cheap;
    const manner = userProfile?.manner;
    const fast = userProfile?.fast;
    const service = userProfile?.service;
    const donation = userProfile?.donation;
    const result = [time, cheap, fast, service, donation, manner];

    const trueValues = result.filter((value) => (value ?? 0) >= 10);
    setBadgeLength(trueValues.length);
  }, [userProfile]);

  return (
    <>
      <BadgeInfo>배지 ({badgeLength})</BadgeInfo>
      <BadgeContainer>
        <BadgeContents>
          {/*절대 지켜 시간 : time*/}
          <BadgeImg
            imageUrl={
              !userProfile
                ? null
                : userProfile.repBadge === 'time'
                ? images[0][0]
                : userProfile.time < 10
                ? images[0][1]
                : userProfile.time >= 10
                ? images[0][2]
                : null
            }
          />
          {/*친절해 : manner*/}
          <BadgeImg
            imageUrl={
              !userProfile
                ? null
                : userProfile.repBadge === 'manner'
                ? images[1][0]
                : userProfile.manner < 10
                ? images[1][1]
                : userProfile.manner >= 10
                ? images[1][2]
                : null
            }
          />
          {/*완전 싸다구 : cheap*/}
          <BadgeImg
            imageUrl={
              !userProfile
                ? null
                : userProfile.repBadge === 'cheap'
                ? images[2][0]
                : userProfile.cheap < 10
                ? images[2][1]
                : userProfile.cheap >= 10
                ? images[2][2]
                : null
            }
          />
          {/*응답 봇 : fast*/}
          <BadgeImg
            imageUrl={
              !userProfile
                ? null
                : userProfile.repBadge === 'fast'
                ? images[3][0]
                : userProfile.fast < 10
                ? images[3][1]
                : userProfile.fast >= 10
                ? images[3][2]
                : null
            }
          />
          {/*A급 상품만 : service*/}
          <BadgeImg
            imageUrl={
              !userProfile
                ? null
                : userProfile.repBadge === 'service'
                ? images[4][0]
                : userProfile.service < 10
                ? images[4][1]
                : userProfile.service >= 10
                ? images[4][2]
                : null
            }
          />
          {/*기부 머신 : donation*/}
          <BadgeImg
            imageUrl={
              !userProfile
                ? null
                : userProfile.repBadge === 'donation'
                ? images[5][0]
                : userProfile.donation < 10
                ? images[5][1]
                : userProfile.donation >= 10
                ? images[5][2]
                : null
            }
          />
        </BadgeContents>
      </BadgeContainer>
    </>
  );
};

export default ProfileBadge;

const BadgeContainer = styled.div`
  width: 1200px;
  height: 172px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
  padding: 24px 80px;
  margin-bottom: 112px;
`;

const BadgeInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.fontSize.ad24};
  margin-bottom: 24px;
`;

const BadgeContents = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const BadgeImg = styled.div<{ imageUrl: string | null }>`
  width: 112px;
  height: 112px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
`;
