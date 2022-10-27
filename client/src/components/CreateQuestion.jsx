/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';

import styled from 'styled-components';
import { toast } from 'react-toastify';

import Option from './Option';

export default function CreateQuestion({
  questions,
  setQuestions,
  data,
  deleteQuestion,
}) {
  const [tempQuestion, setTempQuestion] = useState({
    questionId: data.questionId,
    question: data.question,
    answerType: data.answerType,
    required: data.required,
    option: data.option,
  });
  async function handleInputChange(e) {
    let { name, value } = e.target;
    const customid = name.split(' ')[1];
    name = name.split(' ')[0];

    setTempQuestion((preVal) => ({
      ...preVal,
      [name]: value,
    }));
    if (questions.length > 0) {
      const tempSpread = [...questions];
      tempSpread.forEach((q) => {
        if (q.questionId === customid) {
          'question' === name && (q.question = value);
          'answerType' === name && (q.answerType = value);
          'required' === name && (q.required = value);
        }
      });
      setQuestions([...tempSpread]);
      value === 'text' && removeAllOptions();
    } else {
      setQuestions([...questions, { ...tempQuestion, [name]: value }]);
    }
  }

  async function setOptions(value, index) {
    if (index === 'new' && tempQuestion.option.includes(value)) {
      !toast.isActive('sur-tid') &&
        toast.warning(`duplicate option not allowed`, {
          toastId: 'sur-tid',
          position: 'top-center',
          autoClose: 7000,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      return;
    } else {
      if (index === 'new') index = tempQuestion.option.length;
      const tempVal = { ...tempQuestion };
      const optArr = [...tempVal.option];
      optArr[index] = value;

      setTempQuestion((preVal) => ({
        ...preVal,
        option: [...optArr],
      }));
    }
  }
  async function setOptionsBlur(value, index) {
    if (data.option.includes(value)) {
      !toast.isActive('sur-tid') &&
        toast.warning(`duplicate option not allowed`, {
          toastId: 'sur-tid',
          position: 'top-center',
          autoClose: 7000,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      removeOption(index);
      return;
    }
    // if (questions.length > 0) {
    // }

    const tempSpread = [...questions];
    tempSpread.forEach((q) => {
      q.questionId === data.questionId && (q.option[index] = value);
    });
    setQuestions([...tempSpread]);
  }
  function removeAllOptions() {
    let tempVal = { ...tempQuestion };
    tempVal.option.length = 0;
    setTempQuestion({ ...tempVal });
    let tempSpread = [...questions];
    tempSpread.forEach((q) => {
      q.questionId === data.questionId && (q.option.length = 0);
    });
    setQuestions([...tempSpread]);
  }

  function removeOption(index) {
    if (tempQuestion.option.length === 1) return;
    const tempVal = { ...tempQuestion };
    const tempArr = [...tempVal.option];
    tempArr.splice(index, 1);
    setTempQuestion((preVal) => ({
      ...preVal,
      option: [...tempArr],
    }));
    if (questions.length > 0) {
      const tempSpread = [...questions];
      tempSpread.forEach((q) => {
        q.questionId === data.questionId && q.option.splice(index, 1);
      });
      setQuestions([...tempSpread]);
    }
  }

  return (
    <Component>
      <div id={data.questionId} className="question">
        <div className="question-div">
          <input
            type="text"
            name={`question ${data.questionId}`}
            className="question-input"
            onChange={handleInputChange}
            placeholder=" "
            value={data.question}
          />
          <label>question</label>
        </div>
        <div className="answer-type-div">
          <label>Answer Type</label>
          <div className="ans-type">
            <div className="wrap-ans-type">
              <input
                id={`radio-btn ${data.questionId}`}
                value="radio-btn"
                name={`answerType ${data.questionId}`}
                onClick={handleInputChange}
                type="radio"
              />
              <label htmlFor={`radio-btn ${data.questionId}`}>
                Radio Button
              </label>
            </div>
            <div className="wrap-ans-type">
              <input
                id={`check-box ${data.questionId}`}
                value="check-box"
                name={`answerType ${data.questionId}`}
                onClick={handleInputChange}
                type="radio"
              />
              <label htmlFor={`check-box ${data.questionId}`}>Check Box</label>
            </div>
            <div className="wrap-ans-type">
              <input
                id={`drop-down ${data.questionId}`}
                value="drop-down"
                name={`answerType ${data.questionId}`}
                onClick={handleInputChange}
                customid={data.questionId}
                type="radio"
              />
              <label htmlFor={`drop-down ${data.questionId}`}>Drop down</label>
            </div>
            <div className="wrap-ans-type">
              <input
                id={`text ${data.questionId}`}
                value="text"
                name={`answerType ${data.questionId}`}
                onClick={handleInputChange}
                customid={data.questionId}
                type="radio"
              />
              <label htmlFor={`text ${data.questionId}`}>Text</label>
            </div>
          </div>
        </div>
        <div className="required-div">
          <label>Required</label>
          <div className="wrap-required">
            <input
              id={`yes ${data.questionId}`}
              type="radio"
              name={`required ${data.questionId}`}
              value="true"
              customid={data.questionId}
              onClick={handleInputChange}
            />
            <label htmlFor={`yes ${data.questionId}`}>Yes</label>
          </div>
          <div className="wrap-required">
            <input
              id={`no ${data.questionId}`}
              type="radio"
              name={`required ${data.questionId}`}
              value="false"
              customid={data.questionId}
              onClick={handleInputChange}
            />
            <label htmlFor={`no ${data.questionId}`}>No</label>
          </div>
        </div>
        {['radio-btn', 'drop-down', 'check-box'].includes(data.answerType) &&
          tempQuestion.option.map((opt, index) => (
            <div key={index} className="wrap-option">
              <Option
                value={opt}
                index={index}
                setOptions={setOptions}
                setOptionsBlur={setOptionsBlur}
              />

              <button
                className="option-button close-btn"
                onClick={() => removeOption(index)}
              >
                <i className="fa-solid fa-xmark"></i>Remove
              </button>
            </div>
          ))}
        <div className="wrap-btn">
          {['radio-btn', 'drop-down', 'check-box'].includes(
            data.answerType
          ) && (
            <button
              className="option-button add-btn"
              onClick={() => setOptions('option', 'new')}
            >
              <i className="fa-solid fa-plus"></i> Add Option
            </button>
          )}
          <button
            onClick={() => deleteQuestion(data.questionId)}
            className="delete-question"
          >
            <i className="fa-solid fa-trash"></i>Delete question
          </button>
        </div>
      </div>
    </Component>
  );
}

const Component = styled.div`
  .question {
    padding: 12px 7px;
    background: hsl(0 100% 100% / 0.65);
    border-radius: 7px;
    margin-bottom: 2rem;
    .question-div {
      position: relative;
      border-radius: 5px;
      margin-bottom: 1.5rem;
      height: 54px;
      .question-input {
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        background: hsl(0 100% 100% / 0.89);
        border: 1.5px solid hsl(0 0% 0% / 0.11);
        border-radius: 5px;
        padding-top: 13px;
        padding-left: 8px;
        font: 400 1rem var(--openSansFont);
        &:focus + label,
        &:not(:placeholder-shown) + label {
          font-size: 0.87rem;
          top: 4px;
          color: hsl(0 0% 0% / 0.48);
        }
      }
      label {
        position: absolute;
        left: 8px;
        top: 16px;
        font: 400 1rem var(--openSansFont);
        transition: all 0.3s ease-in-out;
      }
    }
    .answer-type-div {
      /* background: linear-gradient(145deg, #dfdfdf, #f0f0f0); */
      /* box-shadow: 10px 10px 20px hsl(0 0% 0% /0.27), -10px -10px 20px #ffffff; */
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 0.7rem;
      & > label {
        font: 400 1rem var(--openSansFont);
        color: hsl(0 0% 0% / 0.58);
      }
      .ans-type {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(auto-fit, minmax(100px, 130px));
        .wrap-ans-type {
          display: flex;
          gap: 0.4rem;
          align-items: center;
          input {
            accent-color: hsl(265 100% 49%);
          }
          input:checked + label {
            color: hsl(265 100% 49%);
          }
          label {
            font: 400 1rem var(--openSansFont);
          }
        }
      }
    }
    .required-div {
      padding: 8px;
      display: flex;
      gap: 0.8rem;
      margin-bottom: 1rem;
      label {
        font: 400 1rem var(--openSansFont);
      }
      & > label {
        color: hsl(0 0% 0% / 0.58);
      }
      .wrap-required {
        display: flex;
        gap: 0.4rem;
        input {
          accent-color: hsl(265 100% 49%);
        }
        input:checked + label {
          color: hsl(265 100% 49%);
        }
      }
    }
    .wrap-option {
      display: flex;
      /* align-items: center; */
      gap: 1rem;
      position: relative;
      padding: 4px 0;
    }

    .option-button {
      gap: 0.4rem;
      background: transparent;
      box-shadow: inset 10px 10px 18px hsl(0 0% 0% / 0.12),
        inset -10px -10px 28px #ffffff, 8px 8px 14px hsl(0 0% 0% /0.11);
      color: hsl(265 100% 49%);
      cursor: pointer;
      display: flex;
      align-items: center;
      border: none;
      outline: none;
      padding: 8px;
      font: 800 1rem var(--openSansFont);
      border-radius: 5px;
    }
    .wrap-btn {
      display: flex;
      align-items: center;
      padding: 5px;
      .delete-question {
        padding: 8px;
        border-radius: 5px;
        border: none;
        margin-left: auto;
        display: flex;
        gap: 4px;
        color: hsl(8 100% 36%);
        font: 400 1rem var(--openSansFont);
        align-items: center;
        cursor: pointer;
        background: hsl(8 100% 76% / 0.5);
      }
    }
    .close-btn {
      align-self: center;
    }
  }
`;
