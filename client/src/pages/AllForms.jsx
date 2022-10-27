import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AlertModal from '../components/AlertModal';

export default function AllForms({ forms, setForms, deleteFormFunction }) {
  const [isDeleteModal, setIsDeleteModal] = useState({ status: false, id: '' });

  return (
    <Container>

      {forms.map((form) => {
        return (
          <div key={form._id} className="form">
            <h2>{form.surveyName}</h2>
            <div className="hr"></div>

            <div className="wrapper">
              <label>Number of questions</label>
              <div className="value">{form.questions.length}</div>
            </div>

            <div className="wrapper">
              <label>Amount allocated</label>
              <div className="value">{form.amount}</div>
            </div>

            <div className="wrapper">
              <label>date created</label>
              <div className="value">{form.createdDate}</div>
            </div>
            <div className="wrap-btn">
              <Link to={`/admin/home/${form._id}`}>View Response</Link>
              <button
                onClick={() => setIsDeleteModal({ status: true, id: form._id })}
                className="delete-form"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
      {isDeleteModal.status && (
        <AlertModal
          id={isDeleteModal.id}
          setIsDeleteModal={setIsDeleteModal}
          functionHandler={deleteFormFunction}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 260px);

  gap: 1.5rem;

  .form {
    height: fit-content;
    border-radius: 5px;
    background: #eeeeef;
    box-shadow: 10px 10px 28px hsl(0 0% 0% / 0.12);
    backdrop-filter: blur(18px);
    display: flex;
    flex-direction: column;
    padding: 0.89rem;
    h2 {
      font: 600 1.2rem var(--ralewayFont);
      color: hsl(0 0% 0% /0.78);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hr {
      height: 1px;
      width: 90%;
      margin: 0.8rem auto;
      background: hsl(0 0% 0% / 0.12);
    }
    .wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.8rem;
      label {
        width: 50%;
        font: 700 1rem var(--ralewayFont);
        color: hsl(0 0% 0% / 0.62);
      }
      .value {
        font: 400 0.91rem var(--poppinsFont);
        color: hsl(0 0% 0% / 0.88);
      }
    }
    .wrap-btn {
      margin-top: 0.8rem;
      display: flex;
      justify-content: center;
      gap: 9px;
      margin-bottom: 1rem;
      button,
      a {
        cursor: pointer;
        padding: 8px;
        border: none;
        border-radius: 5px;
        outline: none;
        font: 700 1rem var(--openSansFont);
        text-align: center;
        border: 1px solid hsl(265 100% 30% / 0.11);
        box-shadow: 0 19px 29px hsl(0 0% 0% / 0.17);
      }
      .delete-form {
        background: hsl(0 100% 86%);
        border: 1px solid hsl(0 100% 60%);
        color: hsl(0 100% 60%);
      }
      a {
        text-decoration: none;
        background: hsl(0 100% 100% / 0.55);
        color: hsl(275 100% 50%);
        &:hover,
        &:active {
          background: hsl(265 100% 30% / 0.88);
          color: white;
        }
      }
    }
  }

  @media screen and (max-width: 608px) {
    justify-content: center;
  }
`;
