/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';

import { getSpecificSurvey, submitSurvey } from '../utils/APIRoutes';

export default function TakeSurvey() {
  const navigate = useNavigate();
  const { uid, id, cid } = useParams();
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [survey, setsurvey] = useState({
    surveyName: '',
    questions: [],
    amount: 0,
  });
  useEffect(() => {
    if (id && uid) {
      async function getSurvey() {
        setIsLoading(true);
        const { data } = await axios.post(`${getSpecificSurvey}/${id}/view`, {
          userId: uid,
        });
        data && setIsLoading(false);
        if (data.status === '429') {
          toast.error(data.msg, {
            position: 'top-center',
            autoClose: 4000,
            closeOnClick:true,
            closeButton: false,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
          setTimeout(() => navigate(-1), 4600);
        } else if (data.status === 'completed') {
          toast.success(data.msg, {
            position: 'top-center',
            autoClose: 5000,
            closeButton: false,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
          setTimeout(() => navigate(-1), 6000);
        } else {
          if (data.status === true) {
            setsurvey({
              surveyName: data.survey.surveyName,
              questions: data.survey.questions,
              amount: data.survey.amount,
            });
            setAnswers([]);
            data.survey.questions.forEach((data) => {
              setAnswers((prev) => [...prev, { ...data, option: [] }]);
            });
          }
        }
      }
      getSurvey();
    }
  }, []);
  // {
  // 	"surveyId":"6352b9011339d12313798463",
  // 	"userId":"63535cf972c40610b643c1e3",
  // 	"answers": [{"id":"100","question":"choose elective 1","answerType":"radio-btn","required":true,"option":["ooad"]},
  // 							{"id":"101","question":"choose elective 2","answerType":"drop-down","required":true,"option":["ui/ux"]},
  // 							{"id":"103","question":"choose elective 3","answerType":"radio-btn","required":true,"option":["block chain"]}]
  //   creatorId,
  //   surveyName
  // }

  async function sendSurvey(e) {
    const { data } = await axios.post(submitSurvey, {
      surveyId: id,
      userId: uid,
      answers: answers,
      creatorId: cid,
      surveyName: survey.surveyName,
    });
    if (data.status) {
      let users = await JSON.parse(localStorage.getItem('sur-uid'));
      users.amount += survey.amount;
      users.surveys.push(id);
      localStorage.setItem('sur-uid', JSON.stringify(users));
      toast.success(data.msg, {
        toastId: 'sur-tid',
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      setTimeout(() => navigate(-1), 5000);
    }
  }

  function handleAnswerChange(qid, name, value) {
    let tempAnswers = [...answers];
    if (name === 'radio-btn' || name === 'drop-down' || name === 'text') {
      tempAnswers.map(
        (ans) => ans.questionId === qid && (ans.option = [value])
      );
      setAnswers([...tempAnswers]);
    }
    if (name === 'check-box') {
      tempAnswers.forEach((ans) => {
        if (ans.questionId === qid) {
          [...ans.option].includes(value)
            ? (ans.option = [...ans.option].filter((op) => op !== value))
            : (ans.option = [...ans.option, value]);
        }
      });
      setAnswers([...tempAnswers]);
    }
  }

  return (
    <Component>
      <ToastContainer />
      {isLoading && <Loader />}
      {survey.questions.length > 0 && (
        <form onSubmit={sendSurvey}>
          <h3>{survey && survey.surveyName}</h3>
          <div className="hr"></div>
          {survey.questions &&
            survey.questions.map((q) => {
              return (
                <div className="set" id={q.questionId} key={q.questionId}>
                  <div className="question">{q.question}</div>
                  {q.answerType === 'radio-btn' &&
                    q?.option.map((opt, index) => {
                      return (
                        <div
                          key={`${q.questionId}-${index}-radio`}
                          className="radio"
                        >
                          <input
                            name={q?.questionId}
                            id={`${q.questionId}-${index}`}
                            type="radio"
                            onClick={() => {
                              handleAnswerChange(
                                q.questionId,
                                'radio-btn',
                                opt
                              );
                            }}
                          />
                          <label htmlFor={`${q.questionId}-${index}`}>
                            {opt}
                          </label>
                        </div>
                      );
                    })}
                  {q.answerType === 'drop-down' && (
                    <select
                      onClick={(e) => {
                        handleAnswerChange(
                          q.questionId,
                          'drop-down',
                          e.target.value
                        );
                      }}
                      name={q.questionId}
                      id={q.questionId}
                    >
                      {q.option.map((opt, index) => {
                        return (
                          <option key={`${q.questionId}-${index}-drop-down`}>
                            {opt}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {q.answerType === 'text' && (
                    <textarea
                      type="text"
                      onChange={(e) => {
                        handleAnswerChange(
                          q.questionId,
                          'text',
                          e.target.value
                        );
                      }}
                      className="text"
                      name={q.id}
                    />
                  )}
                  {q.answerType === 'check-box' &&
                    q.option.map((opt, index) => {
                      return (
                        <div
                          key={`${q.questionId}-${index}-check-box`}
                          className="check-box"
                        >
                          <input
                            onClick={() => {
                              handleAnswerChange(
                                q.questionId,
                                'check-box',
                                opt
                              );
                            }}
                            name={`${q?.questionId}-${index}`}
                            id={`${q.questionId}-${index}`}
                            type="checkbox"
                            value={opt}
                          />
                          <label htmlFor={`${q.questionId}-${index}`}>
                            {opt}
                          </label>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          <button className="submit">Submit</button>
        </form>
      )}
    </Component>
  );
}

const Component = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: auto;
  margin-right: 5px;
  scroll-behavior: smooth;
  padding: 1.5rem 0;
  &::-webkit-scrollbar {
    width: 7px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(66deg, hsl(275 100% 49%), hsl(265 100% 39%));
    border-radius: 50px;
  }

  form {
    width: 66%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    h3 {
      font: 600 1.4rem var(--MontserratFont);
      text-transform: capitalize;
      letter-spacing: 1.2px;
      margin-bottom: 1rem;
      align-self: center;
      background: linear-gradient(145deg, hsl(270 100% 49%), hsl(280 100% 55%));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hr {
      height: 1px;
      width: 100%;
      align-self: center;
      margin: 0.6rem 0 1rem;
      background: hsl(0 0% 0% / 0.11);
    }
    .set {
      margin-bottom: 2rem;
    }
    .question {
      font: 400 1.1rem var(--poppinsFont);
      margin-bottom: 0.8rem;
      color: hsl(0 0% 0% / 0.879);
    }
    .radio,
    .check-box {
      display: flex;
      margin-bottom: 0.3rem;
      align-items: center;
      padding: 5px;
      gap: 0.3rem;
      input {
        height: 1.1rem;
        aspect-ratio: 1/1;
        accent-color: hsl(265 100% 39%);
        &:checked + label {
          color: hsl(265 100% 39%);
          font-weight: 600;
        }
      }
      label {
        font: 500 1rem var(--openSansFont);
        color: hsl(0 0% 0% / 0.698);
      }
    }
    .text {
      border: none;
      outline: none;
      resize: none;
      height: 55px;
      flex: 1;
      border-bottom: 2px solid hsl(265 100% 38%);
      padding: 0.5rem;
      font: 400 0.94rem var(--openSansFont);
      color: hsl(0 0% 0% / 0.698);
      width: 100%;
      background: hsl(0 100% 100% / 0.12);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border-radius: 5px;
      box-shadow: 0 18px 30px hsl(0 0% 0% / 0.17);
      &::-webkit-scrollbar {
        width: 6px;
        background: none;
      }
      &::-webkit-scrollbar-thumb {
        background: hsl(276 100% 39%);
        border-radius: 5px;
      }
    }
    select {
      border: none;
      outline: none;
      cursor: pointer;
      padding: 0.5rem 0.7rem;
      box-shadow: 0 9px 28px #0000004a;
      font: 505 1rem var(--openSansFont);
      border-radius: 5px;
    }

    .submit {
      align-self: center;
      padding: 0.5rem 2rem;
      font: 600 1.6rem var(--MontserratFont);
      letter-spacing: 1.2px;
      border-radius: 5px;
      border: none;
      outline: none;
      background: hsl(270 100% 59%);
      color: #cfcfcf;
      cursor: pointer;
      box-shadow: 0 9px 28px hsl(0 0% 0%/ 0.29);
      margin-bottom: 1rem;
    }
  }

  @media screen and (max-width: 768px) {
    form {
      padding: 1.5rem 1rem;
      width: 100%;
    }
  }
`;
