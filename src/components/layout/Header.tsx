import { auth } from '../../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useMatch, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import styled from 'styled-components';
import { BsPersonCircle } from 'react-icons/bs';
import SearchInput from '../etc/SearchInput';

const Header = () => {
  const navigate = useNavigate();
  const allMatch = useMatch('/categorypage/all');
  const studyMatch = useMatch('/categorypage/study');
  const playMatch = useMatch('/categorypage/play');
  const adviceMatch = useMatch('/categorypage/advice');
  const etcMatch = useMatch('/categorypage/etc');
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', () => {
    if (scrollY.get() > 80) {
      navAnimation.start('scroll');
    } else {
      navAnimation.start('top');
    }
  });

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //로그아웃 버튼
  const handelClickLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/signin');
      })
      .catch((error) => {
        console.dir('LoginErr:', error);
      });
  };

  return (
    <Nav variants={navVariants} animate={navAnimation} initial={'top'}>
      <HeaderContainer>
        <HeaderWrapper>
          <Link to="/" aria-label="홈으로 이동">
            <Logo>이음</Logo>
          </Link>
          <CategoryWrapper>
            <Items>
              <Item>
                <Link to="/categorypage/all" aria-label="전체">
                  전체{allMatch && <Bar layoutId="bar" />}
                </Link>
              </Item>
              <Item>
                <Link to="/categorypage/study" aria-label="공부">
                  공부 {studyMatch && <Bar layoutId="bar" />}
                </Link>
              </Item>
              <Item>
                <Link to="/categorypage/play" aria-label="놀이">
                  놀이 {playMatch && <Bar layoutId="bar" />}
                </Link>
              </Item>
              <Item>
                <Link to="/categorypage/advice" aria-label="상담">
                  상담 {adviceMatch && <Bar layoutId="bar" />}
                </Link>
              </Item>
              <Item>
                <Link to="/categorypage/etc" aria-label="기타">
                  기타 {etcMatch && <Bar layoutId="bar" />}
                </Link>
              </Item>
            </Items>
          </CategoryWrapper>
        </HeaderWrapper>
        <HeaderRightContainer>
          <HeaderRightWrapper>
            <SearchInput />
            <HeaderRightInfo>
              {saveUser && (
                <>
                  <span>
                    <Link
                      to={`/mypage/${saveUser.uid}`}
                      aria-label="마이페이지 이동"
                    >
                      <BsPersonCircle size={26} />
                    </Link>
                  </span>
                  <WriteBtn
                    onClick={() => {
                      navigate('/writepage');
                    }}
                  >
                    글쓰기
                  </WriteBtn>
                </>
              )}

              <LogOutBtn
                onClick={() => handelClickLogOut()}
                aria-label="로그아웃"
              >
                {!saveUser ? '로그인' : '로그아웃'}
              </LogOutBtn>
            </HeaderRightInfo>
          </HeaderRightWrapper>
        </HeaderRightContainer>
      </HeaderContainer>
    </Nav>
  );
};
export default Header;

const Nav = styled(motion.nav)`
  display: flex;
  align-items: center;
  position: sticky;
  height: 112px;
  width: 100%;
  top: 0;
  padding: 20px 60px;
  z-index: 10;
  color: ${(props) => props.theme.colors.black};
`;

const navVariants = {
  top: { backgroundColor: 'rgba(255,255,255,1)' },
  scroll: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
};

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 40px;
  justify-content: space-between;
`;
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 50%;
  height: 42px;
`;

const Logo = styled.div`
  display: flex;
  width: 122px;
  height: 42px;
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;

const CategoryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: ${(props) => props.theme.fontWeight.medium};
  font-size: ${(props) => props.theme.fontSize.title20};
  width: 410px;
  height: 20px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 40px;
  width: 50px;
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.orange03};
  }
`;

const Bar = styled(motion.span)`
  position: absolute;
  width: 38px;
  height: 3px;
  bottom: -7px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.colors.orange03};
`;

const HeaderRightContainer = styled.div`
  width: 50%;
`;

const HeaderRightWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  width: 100%;
`;

const HeaderRightInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 70%;
`;

const WriteBtn = styled.button`
  background-color: transparent;
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border: 2px solid ${(props) => props.theme.colors.orange01};
  color: ${(props) => props.theme.colors.orange01};
  border-radius: 23px;
  width: 81px;
  height: 40px;
  margin-left: 40px;

  cursor: pointer;
  &:hover {
    border: 2px solid ${(props) => props.theme.colors.black};
    color: ${(props) => props.theme.colors.black};
  }
`;

const LogOutBtn = styled.button`
  background-color: transparent;
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border: 2px solid ${(props) => props.theme.colors.black};
  border-radius: 23px;
  width: 94px;
  height: 40px;
  margin-left: 40px;

  cursor: pointer;
  &:hover {
    border: 2px solid ${(props) => props.theme.colors.orange01};
    color: ${(props) => props.theme.colors.orange01};
  }
`;
