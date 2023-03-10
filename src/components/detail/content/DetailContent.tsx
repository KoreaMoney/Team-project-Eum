import loadable from '@loadable/component';
import parse from 'html-react-parser';
import { useRecoilValue } from 'recoil';
import { detailPostAtom } from '../../../atom';
import * as a from './Content';
const SellerInfo = loadable(() => import('../SellerInfo'));

const DetailContent = () => {
  const postData = useRecoilValue(detailPostAtom);
  return (
    <a.PostRow>
      <a.PostContentWrapper>
        <a.SellerInfoTitle>
          <p>재능 설명</p>
        </a.SellerInfoTitle>
        <a.SellerInfoContent>
          <p>{postData && parse(postData?.[0].content)}</p>
        </a.SellerInfoContent>
      </a.PostContentWrapper>
      <a.PostContentWrapper>
        <a.SellerInfoTitle>
          <p>판매자</p>
        </a.SellerInfoTitle>
        <SellerInfo />
      </a.PostContentWrapper>
    </a.PostRow>
  );
};

export default DetailContent;
