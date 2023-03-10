import { useRecoilValue, useSetRecoilState } from 'recoil';
import { onSalePostAtom, viewKakaoModalAtom } from '../../../atom';

import * as a from '../../detail/content/Content';
import parse from 'html-react-parser';
import BuyerInfo from '../../detail/BuyerInfo';
import SellerInfo from '../../detail/SellerInfo';
import KakaoModal from '../../modal/KakaoModal';

const Content = () => {
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const postData = useRecoilValue(onSalePostAtom);
  const setIsModalActive = useSetRecoilState(viewKakaoModalAtom);

  const onClickKakaoButton = () => {
    setIsModalActive(true);
  };
  return (
    <a.PostRow>
      <a.PostContentWrapper>
        <a.SellerInfoTitle>
          <p>재능설명</p>
        </a.SellerInfoTitle>
        <a.SellerInfoContent>
          <p>{postData && parse(postData?.[0].content)}</p>
        </a.SellerInfoContent>
      </a.PostContentWrapper>
      <a.PostContentWrapper>
        {saveUser.uid === postData?.[0]?.sellerUid ? (
          <>
            <a.SellerInfoTitle>
              <p>구매자</p>
            </a.SellerInfoTitle>
            <BuyerInfo />
            <a.KakaoButton onClick={onClickKakaoButton}>채팅하기</a.KakaoButton>
            <KakaoModal />
          </>
        ) : saveUser.uid === postData?.[0]?.buyerUid ? (
          <>
            <a.SellerInfoTitle>
              <p>판매자</p>
            </a.SellerInfoTitle>
            <SellerInfo />
            <a.KakaoButton onClick={onClickKakaoButton}>채팅하기</a.KakaoButton>
            <KakaoModal />
          </>
        ) : null}
      </a.PostContentWrapper>
    </a.PostRow>
  );
};

export default Content;
