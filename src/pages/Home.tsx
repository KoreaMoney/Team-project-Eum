import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { auth } from '../firebase/Firebase';

const Home = () => {
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/signin')
      })
      .catch((error) => {
        console.log( '로그아웃error: ' ,error);
        
      });
  }
  return (
    <div>
      Home <button onClick={logOut}>로그아웃</button>
    </div>
  );
};

export default Home;
