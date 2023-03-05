import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getPostsId, getSellerPosts, getUsers } from '../../api';
import * as a from '../../styles/styledComponent/detail';
import basicIMG from '../../styles/basicIMG.webp';
import axios from 'axios';

const SellerInfo = () => {
  const { postId, id } = useParams();
  const identifier = id ? id : postId;
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
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



  // 판매자의 프로필이미지를 위해 데이터 가져오기
  const { data: seller } = useQuery(
    ['user', post?.[0].sellerUid],
    () => getUsers(post?.[0].sellerUid),
    {
      enabled: Boolean(post?.[0].sellerUid), // post?.[0].sellerUid가 존재할 때만 쿼리를 시작
      staleTime: Infinity,
    }
  );

  return (
    <a.SellerInfoContainer>
      <a.ProfileContainer>
        <a.Profiles>
          <a.ProfileIMG
            profileIMG={seller?.profileImg ? seller?.profileImg : basicIMG}
            aria-label="프로필 이미지"
          />
        </a.Profiles>
        <a.Profiles>
          <a.NickName>{seller?.nickName}</a.NickName>
        </a.Profiles>
        <a.Profiles
          style={{
            borderLeft: '1px solid #C2C1C1',
          }}
        >
          <a.ClockIconContainer>
            <a.ClockIcon />
          </a.ClockIconContainer>
          <a.BadgeTitle>절대지켜시간</a.BadgeTitle>
        </a.Profiles>
      </a.ProfileContainer>

      <a.ProfileInfoContainer>
        <a.ProfileInfos aria-label="판매상품 10개">
          판매상품 {sellerPosts?.length ? sellerPosts?.length : '0'}개
        </a.ProfileInfos>
        <a.ProfileInfos aria-label="받은 후기">
          후기 {seller?.commentsCount ? seller?.commentsCount : '0'}개
        </a.ProfileInfos>
        <a.ProfileInfos style={{ borderRight: 'none' }}>
          배지 5개
        </a.ProfileInfos>
      </a.ProfileInfoContainer>
    </a.SellerInfoContainer>
  );
};

export default SellerInfo;
