import styled from 'styled-components';
import { auth } from '../../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
  HiQueueList,
  HiPencil,
  HiChatBubbleLeftRight,
  HiEllipsisHorizontalCircle,
} from 'react-icons/hi2';
import { IoGameController } from 'react-icons/io5';
import SearchInput from '../etc/SearchInput';
import { motion } from 'framer-motion';
const svg = {
  start: { pathLength: 0, fill: 'rgba(255, 255, 255, 0)' },
  end: {
    fill: 'rgba(0, 0, 0, 1)',
    pathLength: 1,
  },
};
const Header = () => {
  const navigate = useNavigate();
  const handelClickLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/signin');
      })
      .catch((error) => {
        console.dir('LoginErr:', error);
      });
  };
  const authUid = auth.currentUser?.uid;
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <LoGoSpan>
          <Link to="/">
            <LogoWrapper>
              <Svg>
                <svg
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <motion.path
                    transition={{
                      default: { duration: 5 },
                      fill: { duration: 1, delay: 3 },
                    }}
                    variants={svg}
                    initial="start"
                    animate="end"
                    d="M186.12 343.34c-9.65 9.65-9.65 25.29 0 34.94 9.65 9.65 25.29 9.65 34.94 0L378.24 221.1c19.29-19.29 50.57-19.29 69.86 0s19.29 50.57 0 69.86L293.95 445.1c19.27 19.29 50.53 19.31 69.82.04l.04-.04 119.25-119.24c38.59-38.59 38.59-101.14 0-139.72-38.59-38.59-101.15-38.59-139.72 0l-157.22 157.2zm244.53-104.8c-9.65-9.65-25.29-9.65-34.93 0l-157.2 157.18c-19.27 19.29-50.53 19.31-69.82.05l-.05-.05c-9.64-9.64-25.27-9.65-34.92-.01l-.01.01c-9.65 9.64-9.66 25.28-.02 34.93l.02.02c38.58 38.57 101.14 38.57 139.72 0l157.2-157.2c9.65-9.65 9.65-25.29.01-34.93zm-261.99 87.33l157.18-157.18c9.64-9.65 9.64-25.29 0-34.94-9.64-9.64-25.27-9.64-34.91 0L133.72 290.93c-19.28 19.29-50.56 19.3-69.85.01l-.01-.01c-19.29-19.28-19.31-50.54-.03-69.84l.03-.03L218.03 66.89c-19.28-19.29-50.55-19.3-69.85-.02l-.02.02L28.93 186.14c-38.58 38.59-38.58 101.14 0 139.72 38.6 38.59 101.13 38.59 139.73.01zm-87.33-52.4c9.64 9.64 25.27 9.64 34.91 0l157.21-157.19c19.28-19.29 50.55-19.3 69.84-.02l.02.02c9.65 9.65 25.29 9.65 34.93 0 9.65-9.65 9.65-25.29 0-34.93-38.59-38.59-101.13-38.59-139.72 0L81.33 238.54c-9.65 9.64-9.65 25.28-.01 34.93h.01z"
                  />
                </svg>
              </Svg>
            </LogoWrapper>
          </Link>
        </LoGoSpan>
        <PageSpan>
          {authUid && (
            <>
              <Span>
                <Link to={`/mypage/${authUid}`}>MY PAGE</Link>
              </Span>
              <Span>
                <div>MY LIKE</div>
              </Span>
            </>
          )}
          <LogOutBtn onClick={() => handelClickLogOut()}>
            {!authUid ? 'LOGIN' : 'LOGOUT'}
          </LogOutBtn>
        </PageSpan>
      </HeaderWrapper>
      <CategoriesWrapper>
        <Ul style={{ display: 'flex', gap: '10px' }}>
          <Link to="/categorypage/all">
            <Icon>
              <HiQueueList />
              <li>전체</li>
            </Icon>
          </Link>
          <Link to="/categorypage/study">
            <Icon>
              <HiPencil />
              <li>공부</li>
            </Icon>
          </Link>
          <Link to="/categorypage/play">
            <Icon>
              <IoGameController /> <li>놀이</li>
            </Icon>
          </Link>
          <Link to="/categorypage/advice">
            <Icon>
              <HiChatBubbleLeftRight /> <li>상담</li>
            </Icon>
          </Link>
          <Link to="/categorypage/etc">
            <Icon>
              <HiEllipsisHorizontalCircle /> <li>기타</li>
            </Icon>
          </Link>
        </Ul>
        <SearchDiv>
          <SearchInput />
        </SearchDiv>
      </CategoriesWrapper>
    </HeaderContainer>
  );
};
export default Header;
const HeaderContainer = styled.div`
  background-color: #fff;
  width: 100%;
  height: 10rem;
`;
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 50px;
  align-items: center;
  height: 20px;
`;
const LoGoSpan = styled.span`
  font-size: 2rem;
  color: black;
`;
const LogoWrapper = styled(motion.div)`
  height: 500px;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Svg = styled.svg`
  width: 300px;
  height: 300px;
  path {
    stroke: #000;
    stroke-width: 2;
  }
`;
const PageSpan = styled.span`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 2rem;
  justify-content: end;
  align-items: center;
  font-size: 1rem;
`;
const Span = styled.span`
  color: black;
  transition: color 0.2s ease-in;
  &:hover {
    color: #2196f3;
  }
`;
const LogOutBtn = styled.button`
  background-color: transparent;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 0.95rem;
  transition: color 0.2s ease-in;
  &:hover {
    color: #2196f3;
  }
`;
const CategoriesWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const Ul = styled.ul`
  margin-left: 1%;
`;
const Icon = styled.span`
  display: flex;
  flex-direction: row;
  color: black;
  margin-left: 2rem;
  transition: color 0.2s ease-in;
  &:hover {
    color: #2196f3;
  }
`;
const SearchDiv = styled.div`
  margin-right: 4%;
`;
