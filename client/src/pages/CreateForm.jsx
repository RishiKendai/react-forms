/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createForm } from '../utils/APIRoutes';

import styled from 'styled-components';

import CreateQuestion from '../components/CreateQuestion';

export default function CreateForm() {
  const defaultQuestion = {
    questionId: '',
    question: '',
    answerType: '',
    required: '',
    option: ['option'],
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    surveyName: 'untitled',
    creatorId: '',
    createdDate: new Date().toLocaleDateString(),
    amount: 0,
  });

  useEffect(() => {
    async function fetchAdminId() {
      const admin = await JSON.parse(localStorage.getItem('sur-uid'));
      admin && setFormData({ ...formData, creatorId: admin._id });
    }
    fetchAdminId();
  }, []);

  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    defaultQuestion.questionId = uuidv4();
    setQuestions([...questions, { ...defaultQuestion }]);
  }, []);

  /*
  
  [{
  id:qid,
  question:'',
  answerType:'radio-btn,drop-down,check-box,text',
  required:boolean,
  option[]
  }]
  */
  function handleInputChange(e) {
    e.target.value.length < 32 &&
      setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  async function setQuestionFunction(index) {
    // const containsQuestion = await questions.every(async (q) => {
    //   const tempQues = await { ...q };
    //   tempQues.questionId = '';
    //   return JSON.stringify(tempQues) === JSON.stringify(defaultQuestion);
    // });

    let containQuestion = false;
    for (const iterator of questions) {
      const temp = { ...iterator };
      temp.questionId = '';
      if (JSON.stringify(temp) === JSON.stringify(defaultQuestion)) {
        containQuestion = true;
        break;
      }
    }

    if (questions.length === 0 || containQuestion) {
      !toast.isActive('sur-form') &&
        toast.warning('duplicate question not allowed', {
          toastId: 'sur-form',
          position: 'top-center',
          autoClose: 7000,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      return;
    }
    defaultQuestion.questionId = uuidv4();
    setQuestions([...questions, { ...defaultQuestion }]);
  }

  async function handleCreateForm() {
    const { data } = await axios.post(createForm, {
      ...formData,
      questions: [...questions],
    });
    if (data.status) {
      !toast.isActive('sur-form') &&
        !toast.isActive('sur-form') &&
        toast.success(data.msg, {
          toastId: 'sur-form',
          position: 'top-center',
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      setTimeout(() => {
        navigate('/admin/home');
      }, 5800);
    } else {
      !toast.isActive('sur-form') &&
        !toast.isActive('sur-form') &&
        toast.error(data.msg, {
          toastId: 'sur-form',
          position: 'top-center',
          autoClose: 7000,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
    }
  }

  function handleCancelForm() {
    setQuestions([]);
    setFormData({});
    navigate('/admin/home');
  }
  function deleteQuestion(id) {
    if (questions.length === 1) return;
    const data = questions.filter((q) => q.questionId !== id);
    setQuestions([...data]);
  }
  return (
    <Component>
      <ToastContainer />

      <div className="create-form">
        <div className="header">
          <h2 className="title">Create Form</h2>
          <input
            type="text"
            name="surveyName"
            className="form-title"
            value={formData.surveyName}
            onChange={(e) => handleInputChange(e)}
          />
          <div className="wrap-amount">
            <label htmlFor="form-amount">Amount</label>
            <input
              id="form-amount"
              type="text"
              name="amount"
              className="form-amount"
              value={formData.amount}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className="wrap-btn">
            <button onClick={handleCancelForm} className="cancel-from-btn">
              Cancel Form
            </button>
            <button onClick={handleCreateForm} className="create-from-btn">
              Create Form
            </button>
          </div>
        </div>
        <div className="main">
          {questions.length === 0 ? (
            <CreateQuestion
              questions={questions}
              data={questions}
              setQuestions={setQuestions}
            />
          ) : (
            questions.map((q, index) => {
              return (
                <CreateQuestion
                  key={index}
                  data={q}
                  questions={questions}
                  setQuestions={setQuestions}
                  deleteQuestion={deleteQuestion}
                />
              );
            })
          )}
          <button
            className="add-question"
            onClick={() => setQuestionFunction('new')}
          >
            Add Question
          </button>
        </div>
      </div>
    </Component>
  );
}
const Component = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  .create-form {
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      padding: 2rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      .title {
        font: 900 1.6rem var(--MontserratFont);
        background: linear-gradient(
          -39deg,
          hsl(260 100% 49%),
          hsl(265 100% 59%),
          hsl(267 100% 69%)
        );
        -webkit-text-fill-color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        align-self: center;
        margin-bottom: 2rem;
      }
      .form-title {
        height: 38px;
        width: 100%;
        border: none;
        outline: none;
        font: 500 1.3rem var(--openSansFont);
        background: none;
        padding-top: 10px;
        border-bottom: 1px solid hsl(265 100% 68%);
        color: hsl(265 100% 49%);
        margin-bottom: 2rem;
      }
      .wrap-amount {
        display: flex;
        align-items: center;
        gap: 1rem;
        font: 400 1.2rem var(--poppinsFont);
        label {
          color: hsl(0 0% 0% / 0.58);
        }
        .form-amount {
          width: 130px;
          font: inherit;
          border: 1px solid hsl(265 100% 69%);
          border-radius: 4px;
          padding: 2px 8px;
          outline: none;
          color: hsl(265 100% 49%);
          background: none;
        }
      }
      .wrap-btn {
        margin: 2rem auto 0 auto;
        display: flex;
        gap: 9px;
        button {
          padding: 8px;
          border-radius: 5px;
          border: none;
          outline: none;
          font: 600 1rem var(--openSansFont);
          transition: all 0.4s;
          cursor: pointer;
        }
        .create-from-btn {
          background: hsl(265 100% 39%);
          color: #dcdcdc;
          &:hover,
          &:active {
            color: #ffffff;
          }
        }
        .cancel-from-btn {
          color: hsl(265 100% 39%);
          background: none;
          border: 1px solid hsl(265 100% 39%);
          &:hover,
          &:active {
            color: #ffffff;
            background: hsl(265 100% 39%);
          }
        }
      }
    }
    .main {
      height: 100%;
      overflow-y: auto;
      padding: 2rem 2rem;
      margin-right: 4px;
      ::-webkit-scrollbar {
        width: 6px;
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(
          65deg,
          hsl(270 100% 49%),
          hsl(265 100% 39%),
          hsl(260 100% 49%)
        );
        border-radius: 50px;
      }
      .add-question {
        padding: 8px;
        border: none;
        outline: none;
        font: 800 1rem var(--openSansFont);
        background: hsl(265 100% 45%);
        color: #cfcfcf;
        border-radius: 6px;
        margin: 1rem 0;
        cursor: pointer;
        &:hover,
        &:active {
          color: #ffffff;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    .create-form {
      width: 100%;
      .main {
        padding: 2rem 1rem;
      }
    }
  }
`;
