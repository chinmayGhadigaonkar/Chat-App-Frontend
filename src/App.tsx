import './App.css'
import "@fontsource/roboto/300.css";
import {BrowserRouter , Route , Routes} from 'react-router-dom'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/common/ProtectedRoute';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import FetchRequest from './utils/FetchRequest';
import { login, userExists } from './redux/reducers/auth';
import { useDispatch } from 'react-redux';
import { SocketProvider } from './utils/SocketIo';



function App() {
  const user = localStorage.getItem('authtoken');
  const dispatch = useDispatch();
  
  

  useEffect(() => {
    const checkUser = async () => {
    if(user){
      const res = await FetchRequest.get("user/getuser");
      const { user, success } = res.data;
      
      if (success) {
        // console.log(user);      
        dispatch((userExists(user)));
      }

    }
  }
  checkUser() 
  },[])

  return (
    <>
      <BrowserRouter>
      <SnackbarProvider/>
        <Routes>
          <Route path="/" element={
            <SocketProvider>

            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
            </SocketProvider>
          } />
          


          
          <Route element={<SignIn />} path="/login"/>
          <Route element={<SignUp />} path="/sign-up"/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
