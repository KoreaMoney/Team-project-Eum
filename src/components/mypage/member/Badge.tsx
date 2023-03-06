import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import c_cheap from '../../../styles/badge/choice/c_cheap.webp';
import lock_cheap from '../../../styles/badge/lock/lock_cheap.webp';
import nc_cheap from '../../../styles/badge/notChoice/nc_cheap.webp';

import c_donation from '../../../styles/badge/choice/c_donation.webp';
import lock_donation from '../../../styles/badge/lock/lock_donation.webp';
import nc_donation from '../../../styles/badge/notChoice/nc_donation.webp';

import c_fast from '../../../styles/badge/choice/c_fast.webp';
import lock_fast from '../../../styles/badge/lock/lock_fast.webp';
import nc_fast from '../../../styles/badge/notChoice/nc_fast.webp';

import c_manner from '../../../styles/badge/choice/c_manner.webp';
import lock_manner from '../../../styles/badge/lock/lock_manner.webp';
import nc_manner from '../../../styles/badge/notChoice/nc_manner.webp';

import c_service from '../../../styles/badge/choice/c_service.webp';
import lock_service from '../../../styles/badge/lock/lock_service.webp';
import nc_service from '../../../styles/badge/notChoice/nc_service.webp';

import c_time from '../../../styles/badge/choice/c_time.webp';
import lock_time from '../../../styles/badge/lock/lock_time.webp';
import nc_time from '../../../styles/badge/notChoice/nc_time.webp';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, patchUsers } from '../../../api';
import { useRecoilState } from 'recoil';
import { choiceBadgeAtom } from '../../../atom';

const Badge = () => {
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const [repBadgeChoice, setRepBadgeChoice] = useRecoilState(choiceBadgeAtom);
  const queryClient = useQueryClient();
  const { data: myData } = useQuery(['user', saveUser?.uid], () =>
    getUsers(saveUser?.uid)
  );
  console.log('myData: ', myData);

  useEffect(() => {
    setRepBadgeChoice(myData?.repBadge)
  },[myData?.repBadge])
const images = [
  [c_time, lock_time, nc_time],
  [c_manner, lock_manner, nc_manner],
  [c_cheap, lock_cheap, nc_cheap],
  [c_fast, lock_fast, nc_fast],
  [c_service, lock_service, nc_service],
  [c_donation, lock_donation, nc_donation],
];

  return (
    <BadgeContainer>
      <BadgeInfo>대표 배지 설정</BadgeInfo>
      <BadgeContents>
        {/*절대 지켜 시간 : time*/}
        <BadgeImg
          imageUrl={
            !myData
              ? null
              : repBadgeChoice === 'time'
              ? images[0][0]
              : myData.time < 10
              ? images[0][1]
              : myData.time >= 10
              ? images[0][2]
              : null
          }
          onClick={() => {
            if (myData && myData.time >= 10) {
              setRepBadgeChoice('time');
            }
          }}
        />
        {/*친절해 : manner*/}
        <BadgeImg
          imageUrl={
            !myData
              ? null
              : repBadgeChoice === 'manner'
              ? images[1][0]
              : myData.manner < 10
              ? images[1][1]
              : myData.manner >= 10
              ? images[1][2]
              : null
          }
          onClick={() => {
            if (myData && myData.manner >= 10) {
              setRepBadgeChoice('manner');
            }
          }}
        />
        {/*완전 싸다구 : cheap*/}
        <BadgeImg
          imageUrl={
            !myData
              ? null
              : repBadgeChoice === 'cheap'
              ? images[2][0]
              : myData.cheap < 10
              ? images[2][1]
              : myData.cheap >= 10
              ? images[2][2]
              : null
          }
          onClick={() => {
            if (myData && myData.cheap >= 10) {
              setRepBadgeChoice('cheap');
            }
          }}
        />
        {/*응답 봇 : fast*/}
        <BadgeImg
          imageUrl={
            !myData
              ? null
              : repBadgeChoice === 'fast'
              ? images[3][0]
              : myData.fast < 10
              ? images[3][1]
              : myData.fast >= 10
              ? images[3][2]
              : null
          }
          onClick={() => {
            if (myData && myData.fast >= 10) {
              setRepBadgeChoice('fast');
            }
          }}
        />
        {/*A급 상품만 : service*/}
        <BadgeImg
          imageUrl={
            !myData
              ? null
              : repBadgeChoice === 'service'
              ? images[4][0]
              : myData.service < 10
              ? images[4][1]
              : myData.service >= 10
              ? images[4][2]
              : null
          }
          onClick={() => {
            if (myData && myData.service >= 10) {
              setRepBadgeChoice('service');
            }
          }}
        />
        {/*기부 머신 : donation*/}
        <BadgeImg
          imageUrl={
            !myData
              ? null
              : repBadgeChoice === 'donation'
              ? images[5][0]
              : myData.donation < 10
              ? images[5][1]
              : myData.donation >= 10
              ? images[5][2]
              : null
          }
          onClick={() => {
            if (myData && myData.donation >= 10) {
              setRepBadgeChoice('donation');
            }
          }}
        />
      </BadgeContents>
    </BadgeContainer>
  );
};

export default Badge;

const BadgeContainer = styled.div`
  width: 587px;
  height: 344px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
  padding: 24px 101.5px;
  margin-bottom: 56px;
`;

const BadgeInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.fontSize.title16};
  color: ${(props) => props.theme.colors.gray20};
  text-align: center;
  margin-bottom: 24px;
`;

const BadgeContents = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const BadgeImg = styled.div<{ imageUrl: string | null }>`
  width: 112px;
  height: 112px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
`;
