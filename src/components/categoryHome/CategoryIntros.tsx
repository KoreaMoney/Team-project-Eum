import { useState } from 'react';
import * as a from '../../styles/styledComponent/category';
import Loader from '../etc/Loader';

type CategoryIntroTitleProps = {
  categoryName: string | undefined;
};

const CategoryIntros = ({
  categoryName,
}: CategoryIntroTitleProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {' '}
          <a.CategoryIntroTitle>
            {categoryName === 'all'
              ? '전체'
              : categoryName === 'study'
              ? '공부'
              : categoryName === 'play'
              ? '놀이'
              : categoryName === 'advice'
              ? '상담'
              : categoryName === 'etc'
              ? '기타'
              : '전체'}
          </a.CategoryIntroTitle>
          <a.CategoryIntroContentContainer>
            {categoryName === 'all' ? (
              <a.PTag>전체 글을 한꺼번에 볼 수 있어요.</a.PTag>
            ) : categoryName === 'study' ? (
              <>
                <a.PTag>수학, 영어, 국어 등 교과목이나</a.PTag>
                <a.PTag>
                  공부하다가 궁금한 점이나 모르는 것이 생기면 주저말고
                  물어보세요!
                </a.PTag>
                <a.PTag>이음이 친구들이 단번에 해결해 줄 거예요.</a.PTag>
              </>
            ) : categoryName === 'play' ? (
              <>
                <a.PTag>
                  롤, 배틀그라운드, 서든어택, 로스트아크와 같은 모든 게임들,
                </a.PTag>
                <a.PTag>같이 할 친구나 도와줄 사람이 필요한가요?</a.PTag>
                <a.PTag>이음이 친구들이 단번에 해결해 줄 거예요.</a.PTag>
              </>
            ) : categoryName === 'advice' ? (
              <>
                <a.PTag>
                  취업고민, 연애고민, 그 외 모든 고민들이 있으시다구요?
                </a.PTag>
                <a.PTag>혼자 고민하지 말고 상담 받으세요.</a.PTag>
                <a.PTag>이음이 친구들이 진정성있는 상담을 해드릴거예요!</a.PTag>
              </>
            ) : categoryName === 'etc' ? (
              <>
                <a.PTag>
                  공부, 놀이, 상담에 포함되지 않는 모든 것들을 모아보았어요.
                </a.PTag>
                <a.PTag>팔방미인들이 모여있답니다!</a.PTag>
              </>
            ) : (
              '전체'
            )}
          </a.CategoryIntroContentContainer>
        </>
      )}
    </>
  );
};

export default CategoryIntros;
