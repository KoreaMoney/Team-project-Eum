import { auth } from '../../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router';
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
import { useEffect, useState } from 'react';
import { theme } from '../../styles/theme';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [writeActive, setWriteActive] = useState(false);

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

  const writeActiveChange = () => {
    if (!navigate) {
      setWriteActive(false);
    }
    navigate('/writepage');
    setWriteActive(true);
    setActiveIndex(-1);
  };

  const handleClick = (index: any) => {
    setActiveIndex(index);
    setWriteActive(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      setWriteActive(false);
      setActiveIndex(-1);
    };
    window.onpopstate = handlePopState;
    return () => {
      window.onpopstate = null;
    };
  }, []);

  useEffect(() => {
    // 라우트가 변경될 때마다 activeIndex 상태 업데이트
    categories.forEach((category, index) => {
      if (location.pathname === category.path) {
        setActiveIndex(index);
      }
    });
  }, [activeIndex, location]);

  const categories = [
    { label: '전체', path: '/categorypage/all' },
    { label: '공부', path: '/categorypage/study' },
    { label: '놀이', path: '/categorypage/play' },
    { label: '상담', path: '/categorypage/advice' },
    { label: '기타', path: '/categorypage/etc' },
  ];

  return (
    <Nav variants={navVariants} animate={navAnimation} initial={'top'}>
      <HeaderContainer>
        <HeaderWrapper>
          <Link
            to="/"
            aria-label="홈으로 이동"
            onClick={() => {
              setWriteActive(false);
              setActiveIndex(-1);
            }}
          >
            <Logo>이음</Logo>
          </Link>
          <CategoryWrapper>
            <Items>
              {categories.map((category, index) => (
                <Item
                  key={index}
                  className={activeIndex === index ? 'active' : ''}
                >
                  <Link
                    to={category.path}
                    onClick={() => handleClick(index)}
                    aria-label={category.label}
                  >
                    {category.label}
                  </Link>
                </Item>
              ))}
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
                      onClick={() => {
                        setWriteActive(false);
                      }}
                    >
                      <BsPersonCircle size={30} />
                    </Link>
                  </span>
                  <WriteBtn
                    className={writeActive ? 'active' : ''}
                    onClick={writeActiveChange}
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
  color: ${(props) => props.theme.colors.gray30};
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.black};
    font-weight: ${theme.fontWeight.bold};
  }
  &.active {
    color: ${(props) => props.theme.colors.orange02Main};
    font-weight: ${theme.fontWeight.bold};
  }
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
  border: 2px solid ${(props) => props.theme.colors.gray30};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 23px;
  width: 81px;
  height: 40px;
  margin-left: 40px;

  cursor: pointer;
  &:hover {
    border: 3px solid ${(props) => props.theme.colors.black};
    color: ${(props) => props.theme.colors.black};
    font-weight: ${(props) => props.theme.fontWeight.bold};
  }
  &.active {
    border: 3px solid ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.orange02Main};
    font-weight: ${theme.fontWeight.bold};
  }
`;

const LogOutBtn = styled.button`
  background-color: transparent;
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border: 2px solid ${(props) => props.theme.colors.gray30};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 23px;
  width: 94px;
  height: 40px;
  margin-left: 40px;

  cursor: pointer;
  &:hover {
    border: 3px solid ${(props) => props.theme.colors.black};
    color: ${(props) => props.theme.colors.black};
    font-weight: ${(props) => props.theme.fontWeight.bold};
  }
  &:active {
    border: 3px solid ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.orange02Main};
    font-weight: ${theme.fontWeight.bold};
  }
`;
