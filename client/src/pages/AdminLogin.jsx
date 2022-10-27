/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import InputText from '../components/InputText';

import { adminLoginRoute } from '../utils/APIRoutes';

export default function AdminLogin() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  useEffect(() => {
    if (localStorage.getItem('sur-uid')) navigate('/admin/home');
  }, []);

  async function validateLogin(e) {
    e.preventDefault();
    const emailDiv = emailRef.current;
    const passwordDiv = passwordRef.current;
    const { data } = await axios.post(adminLoginRoute, {
      email: emailDiv.value,
      password: passwordDiv.value,
    });
    if (data.status === false) {
      !toast.isActive('sur-tid') &&
        toast.error(data.msg, {
          toastId: 'sur-tid',
          position: 'top-right',
          autoClose: 7000,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
    }
    if (data.status === true) {
      localStorage.setItem('sur-uid', JSON.stringify(data.admin));
      navigate('/admin/home');
    }
  }

  return (
    <Container>
      <ToastContainer />
      <form id="login-form" onSubmit={validateLogin}>
        <h1>Admin Login</h1>
        <InputText
          inputRef={emailRef}
          label="Enter email id"
          name="email"
          type="text"
        />
        <InputText
          inputRef={passwordRef}
          label="Enter password"
          name="password"
          type="password"
        />
        <button className="login-btn" type="submit">
          Login
        </button>
        <div className="footer">
          <h2>Dont have an account</h2>
          <Link className=".link" to="/admin/register">
            Sign up
          </Link>
        </div>
      </form>
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  #login-form {
    width: 300px;
    border-radius: 8px;
    box-shadow: 18px 8px 26px #bebebe, -8px -8px 26px #ffffff;
    padding: 2rem 0.9rem;
    display: flex;
    flex-direction: column;
  }
  h1 {
    align-self: center;
    margin-bottom: 1rem;
    letter-spacing: 2px;
    font: 600 1.5rem var(--arimaFont);
  }
  .login-btn {
    border: none;
    align-self: center;
    height: 45px;
    letter-spacing: 2px;
    font: 800 1.12rem var(--MontserratFont);
    color: #bebebe;
    padding: 0.2rem 2rem;
    border-radius: 4px;
    box-shadow: 4px 9px 19px hsl(0 0% 0% / 0.31);
    background: hsl(270 99% 50%);
    margin-bottom: 2rem;
    &:hover,
    &:active {
      color: #ffffff;
      cursor: pointer;
    }
  }
  .footer {
    display: flex;
    gap: 1rem;
    align-self: center;
    h2 {
      font: 400 1rem var(--ralewayFont);
    }
    a {
      color: hsl(270 99% 50%);
      font: 600 1rem var(--ralewayFont);
      text-decoration: none;
    }
  }
`;
