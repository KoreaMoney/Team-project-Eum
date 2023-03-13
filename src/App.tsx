import Router from './router/Router';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const App = () => {
  return (
    <>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <div className="app">
            <Helmet>
              <title>이음 - 재능마켓(재능을 연결하다)</title>
              <meta charSet="utf-8" />
              <meta
                name="description"
                content="이음 재능을 이어주다. 세상 모든 사소한 재능의 가치를 상승시킨다."
              />
              <meta name="keywords" content="이음, 재능마켓" />
              <meta name="copyright" content="노른자팀" />
            </Helmet>
          </div>
          <GlobalStyle />
          <Router />
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
};
export default App;
