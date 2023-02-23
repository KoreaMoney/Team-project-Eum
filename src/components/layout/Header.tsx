import styled from 'styled-components';
import { auth } from '../../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import SearchInput from '../etc/SearchInput';
import { motion } from 'framer-motion';
import {
  HiQueueList,
  HiPencil,
  HiChatBubbleLeftRight,
  HiEllipsisHorizontalCircle,
} from 'react-icons/hi2';
import { IoGameController } from 'react-icons/io5';

const svg = {
  start: { pathLength: 0, fill: 'rgba(255, 255, 255, 0)' },
  end: {
    fill: 'rgba(0, 0, 0, 1)',
    pathLength: 1,
  },
};
const Header = () => {
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

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

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <Div>
          <LoGoSpan>
            <Link to="/">
              <LogoWrapper>
                <Svg>
                  <svg
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <motion.path
                      transition={{
                        default: { duration: 5 },
                        fill: { duration: 1, delay: 3 },
                      }}
                      variants={svg}
                      initial="start"
                      animate="end"
                      d="M80 104c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24zm32.4 49.2c28-12.4 47.6-40.5 47.6-73.2c0-44.2-35.8-80-80-80S0 35.8 0 80c0 32.8 19.7 61 48 73.3V358.7C19.7 371 0 399.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3V272c26.7 20.1 60 32 96 32h86.7c12.3 28.3 40.5 48 73.3 48c44.2 0 80-35.8 80-80s-35.8-80-80-80c-32.8 0-61 19.7-73.3 48H208c-49.9 0-91-38.1-95.6-86.8zM80 456c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24zM392 272c0 13.3-10.7 24-24 24s-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24z"
                    />
                  </svg>
                </Svg>
                <Eum>eum</Eum>
              </LogoWrapper>
            </Link>
          </LoGoSpan>

          <PageSpan>
            {saveUser && (
              <>
                <Span>
                  <Link to={`/mypage/${saveUser.uid}`}>MY PAGE</Link>
                </Span>
                <Span>
                  <div>MY LIKE</div>
                </Span>
              </>
            )}
            <LogOutBtn onClick={() => handelClickLogOut()}>
              {!saveUser ? 'LOGIN' : 'LOGOUT'}
            </LogOutBtn>
          </PageSpan>
        </Div>
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
      </HeaderWrapper>
    </HeaderContainer>
  );
};
export default Header;
const HeaderContainer = styled.div`
  background-color: ${(props) => props.theme.colors.brandColor};
  width: 100%;
  height: 10rem;
  /* position: sticky; //상단 고정
  top: 0px; //상단고정
  z-index: 10; //상단 고정 */
`;
const HeaderWrapper = styled.div`
  width: 70%;
  margin: 0 auto;
`;
const Div = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const LoGoSpan = styled.span`
  margin-top: 2rem;
  color: ${(props) => props.theme.colors.black};
`;
const LogoWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 50%;
`;

const Svg = styled.svg`
  width: 100%;
  height: 3rem;
  path {
    stroke: #000;
    stroke-width: 2;
  }
`;

const Eum = styled.div`
  font-size: ${(props) => props.theme.fontSize.title36};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;

const PageSpan = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  width: 100%;
  gap: 2rem;
  font-size: ${(props) => props.theme.fontSize.body16};
`;

const Span = styled.div`
  color: ${(props) => props.theme.colors.black};
  margin-top: 2rem;
  transition: color 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.colors.button};
    font-weight: ${(props) => props.theme.fontWeight.medium};
  }
`;

const LogOutBtn = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-top: 2rem;
  font-size: ${(props) => props.theme.fontSize.body16};
  transition: color 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.colors.button};
    font-weight: ${(props) => props.theme.fontWeight.medium};
  }
`;

const CategoriesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  width: 100%;
`;

const Ul = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-size: ${(props) => props.theme.fontSize.body16};
  width: 40%;
`;

const Icon = styled.span`
  display: flex;
  flex-direction: row;
  color: ${(props) => props.theme.colors.black};
  transition: color 0.1s ease-in;
  &:hover {
    color: ${(props) => props.theme.colors.button};
  }
`;

const SearchDiv = styled.div`
  width: 28%;
`;
