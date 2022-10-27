/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';

import { getAllSurvey } from '../utils/APIRoutes';

export default function UserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [survey, setSurvey] = useState({
    status: false,
    data: [],
  });
  useEffect(() => {
    console.count('rendered');
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (!localStorage.getItem('sur-uid')) navigate('/user/login');
      else {
        setUser(JSON.parse(localStorage.getItem('sur-uid')));
      }
    }
    fetchUser();
  }, []);
  useEffect(() => {
    async function fetchForms() {
      if (user) {
        setIsLoading(true);
        const { data } = await axios.post(getAllSurvey);
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
        data && setIsLoading(false);
        if (data.status === true)
          setSurvey({ status: data.status, data: data.response });
      }
    }
    fetchForms();
  }, []);
  function handleLogout() {
    localStorage.removeItem('sur-uid');
    navigate('/user/login');
  }
  return (
    <Component>
      <ToastContainer />
      {isLoading && <Loader />}
      <header>
        <div className="greeting">
          <h3>
            Welcome <span>{user.name}</span> 👋
          </h3>
        </div>
        <div className="wallet">
          amount: <span>{user.amount}</span>
        </div>
        <div className="logout" onClick={handleLogout}>
          Logout
        </div>
      </header>
      <div className="wrap-form">
        {survey.status &&
          survey.data.map((data) => {
            return (
              <div className="card" key={data._id}>
                <h2>{data.surveyName}</h2>
                <div className="amount">
                  amount: <span>{data.amount}</span>
                </div>
                <div className="date">
                  Created Date: <span>{data.createdDate}</span>
                </div>
                {user?.id && user?.survey.includes(data._id) ? (
                  <Link>Completed</Link>
                ) : (
                  <Link
                    to={`/user/${user._id}/take-survey/${data._id}/${data.creatorId}`}
                  >
                    Fill Form
                  </Link>
                )}
              </div>
            );
          })}
      </div>
    </Component>
  );
}
const Component = styled.div`
  height: 100vh;
  background: #dfdfdf;
  display: flex;
  flex-direction: column;
  header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 3% 4% 1%;

    .greeting {
      h3 {
        color: hsl(0 0% 0% / 0.75);
        font: 550 1.5rem var(--MontserratFont);
        span {
          color: hsl(265 100% 39%);
        }
      }
    }
    .wallet,
    .logout {
      background: linear-gradient(145deg, #f0f0f0, #cacaca);
      box-shadow: 18px 18px 28px hsl(0 0% 0% / 0.18), -18px -18px 27px #ffffff;
      padding: 9px 12px;
      margin: 0 0 0 2rem;
      font: 600 1.15rem var(--openSansFont);
      color: #898989;
      cursor: default;
      border-radius: 8px;
    }
    .logout {
      cursor: pointer;
      &:hover,
      &:active {
        color: #191919;
      }
    }
    .wallet {
      margin-left: auto;
      color: hsl(265 100% 49%);
      text-transform: capitalize;
      span {
        color: hsl(0 0% 0% / 0.75);
      }
    }
  }
  .wrap-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, 280px);
    align-items: flex-start;
    gap: 2.5rem;
    height: 100%;
    overflow-y: auto;
    padding: 3% 4% 1%;

    ::-webkit-scrollbar {
      width: 6px;
      background: transparent;
    }
    ::-webkit-scrollbar-track {
      background: #272727;
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 5% 4%;
      border-radius: 7px;
      box-shadow: -18px -18px 28px hsl(0 100% 100%),
        18px 18px 28px hsl(0 0% 0% / 0.18);
      h2 {
        background: linear-gradient(34deg, hsl(270 99% 68%), hsl(260 99% 48%));
        -webkit-text-fill-color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        font: 600 1.5rem var(--ralewayFont);
        text-transform: capitalize;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 0.6rem;
      }
      .amount,
      .date {
        color: hsl(22 0% 0% / 0.545);
        font: 400 1.1rem var(--poppinsFont);
        span {
          margin-left: 7px;
          color: hsl(22 0% 0% / 0.845);
        }
      }
      a {
        width: 50%;
        align-self: center;
        margin: 0.8rem 0 0.5rem;
        text-decoration: none;
        font: 600 1.1rem var(--openSansFont);
        background: hsl(260 99% 55%);
        padding: 6px;
        color: #ffffff99;
        text-align: center;
        border-radius: 50px;
        box-shadow: 0 8px 18px hsl(0 0% 0% /0.48);
        &:hover,
        &:active {
          color: #ffffff;
        }
      }
    }
  }
`;
