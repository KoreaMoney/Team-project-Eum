import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CategoryPage from '../pages/CategoryPage';
import Detail from '../pages/Detail';
import EditPage from '../pages/EditPage';
import Home from '../pages/Home';
import Landing from '../pages/Landing';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import WritePage from '../pages/WritePage';
import CategoryPageDetail from '../pages/CategoryPageDetail';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:categoryName/:id" element={<Detail />} />
        <Route path="/writepage" element={<WritePage />} />
        <Route path="/editpage/:id" element={<EditPage />} />
        <Route path="/categorypage/:categoryName" element={<CategoryPage />} />
        <Route
          path="/categorypage/:categoryName/:id"
          element={<CategoryPageDetail />}
        />
        <Route path="/mypage/:id" element={<MyPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
    // 하나의 page
  );
};

export default Router;
