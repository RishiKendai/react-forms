import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import AdminHome from './pages/AdminHome';
import Form from './pages/Form';
import UserHome from './pages/UserHome';
import TakeSurvey from './pages/TakeSurvey';
import CreateForm from './pages/CreateForm';
import Error from './components/Error';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<UserLogin />} />
        <Route exact path="/admin/login" element={<AdminLogin />} />
        <Route exact path="/admin/home" element={<AdminHome />} />
        <Route exact path="/admin/create-form" element={<CreateForm />} />
        <Route exact path="/admin/home/:id" element={<Form />} />
        <Route exact path="/admin/register" element={<AdminRegister />} />
        <Route exact path="/user/login" element={<UserLogin />} />
        <Route exact path="/user/home" element={<UserHome />} />
        <Route exact path="/user/register" element={<UserRegister />} />
        <Route path="*" element={<Error />} />
        <Route
          exact
          path="/user/:uid/take-survey/:id/:cid"
          element={<TakeSurvey />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
