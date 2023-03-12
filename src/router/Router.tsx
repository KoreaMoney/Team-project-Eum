import loadable from '@loadable/component';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Detail from '../pages/Detail';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Transaction from '../pages/Transaction';

/**Code Spliting 진행
 * spliting을 하는 이유는 하나의 페이지가 아닌 하나의 import로 인식하게 하여 랜더링 속도를 증가 시키기 위함
 */
const CategoryPage = loadable(() => import('../pages/CategoryPage'));
const EditPage = loadable(() => import('../pages/EditPage'));
const Footer = loadable(() => import('../components/layout/Footer'));
const MyPage = loadable(() => import('../pages/MyPage'));
const WritePage = loadable(() => import('../pages/WritePage'));
const ReviewPage = loadable(() => import('../pages/ReviewPage'));
const Error404 = loadable(() => import('../components/error/Error404'));
const UserProfile = loadable(() => import('../pages/UserProfile'));

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
          <Route path="/userprofile/:id" element={<UserProfile />} />
          <Route path="review/:id" element={<ReviewPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route path="/*" element={<Error404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};
export default Router;
