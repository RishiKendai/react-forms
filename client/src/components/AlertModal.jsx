import React from 'react';
import styled from 'styled-components';

export default function AlertModal({ id, setIsDeleteModal, functionHandler }) {
  return (
    <Component>
      <div className="alertModal">
        <div className="head">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <h2>Warning!!</h2>
        </div>
        <div className="content">Are you sure you want to delete ?</div>
        <div className="wrap-btn">
          <button
            onClick={() => {
              setIsDeleteModal({ status: false, id: '' });
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              functionHandler(id);
              setIsDeleteModal({ status: false, id: '' });
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Component>
  );
}

const Component = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: 1;
  background: hsl(0 0% 0% / 0.12);
  backdrop-filter: blur(3px);
  user-select: none;
  .alertModal {
    width: 390px;
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    background: hsl(0 100% 100% / 0.6);
    box-shadow: 0 10px 39px hsl(0 0% 0% / 0.21);
    height: fit-content;
    padding: 12px;
    border-radius: 5px;
    border: 2.5px solid hsl(0 100% 100% / 0.87);
    backdrop-filter: blur(24px) saturate(100%);
    .head {
      display: flex;
      gap: 8px;
      padding: 8px;
      align-items: center;
      .fa-triangle-exclamation {
        font-size: 1.7rem;
        color: hsl(58 100% 60%);
        text-shadow: 0 0 5px hsl(0 0% 0% / 0.24);
      }
      h2 {
        color: hsl(23 0% 0% / 0.65);
        font: 600 1.3rem var(--MontserratFont);
      }
    }
    .content {
      padding: 8px;
      color: hsl(23 0% 0% / 0.78);
      font: 400 1.12rem var(--poppinsFont);
      margin-bottom: 0.6rem;
    }
    .wrap-btn {
      margin-left: auto;
      padding: 8px;
      display: flex;
      gap: 1rem;
      button {
        padding: 8px 12px;
        cursor: pointer;
        border: none;
        outline: none;
        background: hsl(0 100% 100% / 0.35);
        font: 400 1rem var(--MontserratFont);
        border-radius: 6px;
        &:nth-child(1) {
          border: 1.4px solid hsl(0 0% 0% / 0.26);
        }
        &:nth-child(2) {
          background: hsl(0 100% 88%);
          color: hsl(0, 100%, 60%);
          border: 1.4px solid hsl(0 100% 60% / 0.48);
        }
      }
    }
  }
`;
