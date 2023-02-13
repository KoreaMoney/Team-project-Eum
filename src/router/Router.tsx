import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Detail from '../pages/Detail';
import EditPage from '../pages/EditPage';
import Home from '../pages/Home';
import Landing from '../pages/Landing';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import WritePage from '../pages/WritePage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/writepage/:id" element={<WritePage />} />
        <Route path="/editpage/:id" element={<EditPage />} />
        <Route path="/mypage:id" element={<MyPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
