import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { loginUserCheckState } from './atom';
import { auth } from './firebase/Firebase';
import Router from './router/Router';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
// import { isDarkAtom } from './atom';
// import { useRecoilValue } from 'recoil';
// import { darkTheme, lightTheme } from './theme';

const App = () => {
  /**Recoil적용을 위해 임시적으로 다크모드 생성 후 주석 처리 합니다
   * 삭제는 말아주세요
   * ReactQueryDevtools는 react query통신 여부 확인을 위한 라이브러리 입니다
   */
  // const isDark = useRecoilValue(isDarkAtom);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </>
  );
};
export default App;
