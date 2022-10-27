/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import AllForms from './AllForms';
import Loader from '../components/Loader';
import { fetchAllForms, deleteForms } from '../utils/APIRoutes';

export default function AdminHome() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ id: '', name: '' });
  const [forms, setForms] = useState({ status: false, data: [] });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchUser() {
      if (!localStorage.getItem('sur-uid')) navigate('/admin/login');
      else {
        let adminObj = await JSON.parse(localStorage.getItem('sur-uid'));
        setAdmin({ id: adminObj._id, name: adminObj.name });
        adminObj = undefined;
      }
    }
    fetchUser();
  }, []);
  async function fetchForms() {
    if (admin) {
      setIsLoading(true);
      setIsLoading(false);
      const { data } = await axios.post(fetchAllForms, {
        adminId: admin?.id,
      });
      data && setIsLoading(false);
      if (data.status === false)
        !toast.isActive('sur-tid') &&
          toast.error(data.msg, {
            toastId: 'sur-tid',
            position: 'top-right',
            autoClose: 7000,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
          });
      if (data.status === true)
        setForms({ status: data.status, data: data.response });
    }
  }
  useEffect(() => {
    fetchForms();
  }, [admin]);

  function logout() {
    localStorage.removeItem('sur-uid');
    navigate('/admin/login');
  }
  async function deleteFormFunction(surveyId) {
    const { data } = await axios.post(deleteForms, { formId: surveyId });
    if (data.status) {
      !toast.isActive('sur-tid') &&
        toast.success(data.msg, {
          toastId: 'sur-tid',
          position: 'top-right',
          autoClose: 7000,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      fetchForms();
    } else {
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
  }
  return (
    <Container>
      <ToastContainer />
      {isLoading && <Loader />}
      <header>
        <div className="greeting">
          <h3>
            Welcome <span>{admin.name}</span> 👋
          </h3>
        </div>
        <button
          className="create-btn"
          onClick={() => navigate('/admin/create-form')}
        >
          create form
        </button>
        <div className="logout" onClick={logout}>
          Logout
        </div>
      </header>
      {forms.status && (
        <AllForms
          deleteFormFunction={deleteFormFunction}
          forms={forms.data}
          setForms={setForms}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  padding: 3% 4% 1%;
  background: #dfdfdf;
  display: flex;
  flex-direction: column;
  header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .greeting {
      h3 {
        color: hsl(0 0% 0% / 0.75);
        font: 550 1.5rem var(--MontserratFont);
        span {
          color: hsl(265 100% 39%);
        }
      }
    }
    .create-btn,
    .logout {
      border: none;
      outline: none;
      background: linear-gradient(145deg, #f0f0f0, #cacaca);
      box-shadow: 18px 18px 28px hsl(0 0% 0% / 0.18), -18px -18px 27px #ffffff;
      padding: 9px 12px;
      font: 600 1.2rem var(--openSansFont);
      color: #898989;
      border-radius: 8px;
    }
    .logout {
      cursor: pointer;
      &:hover,
      &:active {
        color: #191919;
      }
    }
    .create-btn {
      margin-left: auto;
      margin-right: 1rem;
      color: hsl(265 100% 49%);
    }
  }
  @media screen and (max-width: 768px) {
    header {
      .greeting {
        h3 {
          font-size: 1.13rem;
        }
      }
      .create-btn {
        font-size: 0.95rem;
      }
    }
  }
`;
