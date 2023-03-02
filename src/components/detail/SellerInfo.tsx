import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getPostsId, getUsers } from '../../api';
import * as a from '../../styles/styledComponent/detail';
import basicIMG from '../../styles/basicIMG.webp';

const SellerInfo = () => {
  const { id } = useParams();

  const { data: post } = useQuery(['post', id], () => getPostsId(id), {
    staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
  });
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
    <div>
      <a.ProfileIMG
        profileIMG={seller?.profileImg ? seller?.profileImg : basicIMG}
        aria-label="프로필 이미지"
      />
      <div>
        <p>닉네임 : {seller?.nickName}</p>
      </div>
      <div>
        <span>
          연락가능시간:
          {seller?.contactTime ? seller?.contactTime : '00:00 ~ 24:00'}
        </span>
      </div>
      <div>
        <button aria-label="판매상품 10개">판매상품 10개</button>
        <button aria-label="받은 후기">받은 후기</button>
      </div>
    </div>
  );
};

export default SellerInfo;
