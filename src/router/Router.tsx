import loadable from '@loadable/component';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**Code Spliting 진행
 * spliting을 하는 이유는 하나의 페이지가 아닌 하나의 import로 인식하게 하여 랜더링 속도를 증가 시키기 위함
 */
const Layout = loadable(() => import('../components/layout/Layout'));
const CategoryPage = loadable(() => import('../pages/CategoryPage'));
const Detail = loadable(() => import('../pages/Detail'));
const EditPage = loadable(() => import('../pages/EditPage'));
const Home = loadable(() => import('../pages/Home'));
const MyPage = loadable(() => import('../pages/MyPage'));
const SignIn = loadable(() => import('../pages/SignIn'));
const SignUp = loadable(() => import('../pages/SignUp'));
const Transaction = loadable(() => import('../pages/Transaction'));
const WritePage = loadable(() => import('../pages/WritePage'));
const ReviewPage = loadable(() => import('../pages/ReviewPage'));
const Error404 = loadable(() => import('../components/error/Error404'));

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:categoryName/:id" element={<Detail />} />
          <Route path="/writepage" element={<WritePage />} />
          <Route path="/editpage/:id" element={<EditPage />} />
          <Route
            path="/categorypage/:categoryName"
            element={<CategoryPage />}
          />
          <Route
            path="/search/:categoryName/:select/:word"
            element={<CategoryPage />}
          />
          <Route path="/mypage/:id" element={<MyPage />} />
          <Route
            path="/detail/:categoryName/:postId/:buyerId/:uuid"
            element={<Transaction />}
          />
          <Route path="review/:id" element={<ReviewPage />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
