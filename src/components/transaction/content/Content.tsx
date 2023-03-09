import React from 'react';
import { useRecoilValue } from 'recoil';
import { detailPostAtom } from '../../../atom';
import * as a from '../../detail/content/Content';
import parse from 'html-react-parser';
import BuyerInfo from '../../detail/BuyerInfo';
import SellerInfo from '../../detail/SellerInfo';
import KakaoModal from '../../modal/KakaoModal';

const Content = () => {
  const postData = useRecoilValue(detailPostAtom);
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  return (
    <a.PostRow>
      <a.PostContentWrapper>
        <a.SellerInfoTitle>
          <p>설명</p>
        </a.SellerInfoTitle>
        <a.SellerInfoContent>
          <p>{postData && parse(postData?.[0].content)}</p>
        </a.SellerInfoContent>
      </a.PostContentWrapper>
      <a.PostContentWrapper>
        {saveUser.uid === postData?.[0].sellerUid ? (
          <>
            <a.SellerInfoTitle>
              <p>구매자</p>
            </a.SellerInfoTitle>
            <BuyerInfo />
          </>
        ) : (
          <>
            <a.SellerInfoTitle>
              <p>판매자</p>
            </a.SellerInfoTitle>
            <SellerInfo />
            <KakaoModal />
          </>
        )}
      </a.PostContentWrapper>
    </a.PostRow>
  );
};

export default Content;
