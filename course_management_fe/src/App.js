import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home/HomePage'
import { useState, useEffect } from 'react'
import Login from './pages/authen/Login';
import Register from './pages/authen/Register';
import FindTeamMate from './pages/teammate/FindTeam';
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from './pages/authen/PrivateRoute'
import OAuth2RedirectHandler from './pages/authen/OAuth2RedirectHandler';
import ModalLoading from './layout/modal/ModalLoading';
import Header from './layout/header/Header';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Profile from './pages/profile/Information';
import ChangePassword from './pages/profile/ChangePassword';
import Message from './pages/message/message';
import ActiveAccountRedirect from './pages/authen/ActiveAccountRedirectHandler';
import ForgotPassword from './pages/authen/ForgotPassword';
import SetNewPassword from './pages/authen/SetNewPassword';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("accessToken") ? true : false);
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <Header setAuthenticated={setIsAuthenticated} isLogin={isAuthenticated} />
      <Routes>
        <Route path="/">
          <Route index element={
            <PrivateRoute authenticated={isAuthenticated} setLoading={setLoading}>
              <Home setLoading={setLoading} />
            </PrivateRoute>
          } />
          <Route path="/team" element={
            <PrivateRoute authenticated={isAuthenticated} setLoading={setLoading}>
              <FindTeamMate />
            </PrivateRoute>
          } />
          <Route path="/message" element={
            <PrivateRoute authenticated={isAuthenticated} setLoading={setLoading}>
              <Message />
            </PrivateRoute>
          } />
          <Route path="/profile/information" element={
            <PrivateRoute authenticated={isAuthenticated} setLoading={setLoading}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/profile/changepassword" element={
            <PrivateRoute authenticated={isAuthenticated}  >
              <ChangePassword setLoading={setLoading} />
            </PrivateRoute>
          } />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler setAuthenticated={setIsAuthenticated} />}></Route>
          <Route path="/verify/redirect" element={<ActiveAccountRedirect />}></Route>

          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Login setAuthenticated={setIsAuthenticated} setLoading={setLoading} />} />
              <Route path="/register" element={<Register setLoading={setLoading} />} />
              <Route path="/forgotpassword" element={<ForgotPassword setLoading={setLoading} />} />
              <Route path="/newpassword" element={<SetNewPassword setLoading={setLoading} />} />


            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />

        </Route>
      </Routes>
      <ModalLoading isLoading={isLoading} />
      <ToastContainer autoClose={3000} />
    </>

  );
}

export default App;
