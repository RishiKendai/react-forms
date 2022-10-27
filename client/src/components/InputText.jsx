import React from 'react';

import styled from 'styled-components';

export default function InputText({ label, name, type, inputRef }) {
  return (
    <Input>
      <input type={type} name={name} ref={inputRef} placeholder=" " />
      <label>{label}</label>
    </Input>
  );
}

const Input = styled.div`
  height: 50px;
  margin: 0 5px 1.4rem;
  position: relative;
  border-radius: 4px;
  border: 1px solid hsl(270 99% 56%);

  input {
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    border-radius: 4px;
    background: none;
    padding-left: 5px;
    padding-top: 18px;
    color: #323232;
    font: 400 1rem var(--poppinsFont);
    &:focus + label,
    &:not(:placeholder-shown) + label {
      top: 3px;
      font-size: 0.8rem;
      color: #191919;
    }
  }
  label {
    position: absolute;
    left: 5px;
    top: 15px;
    font: 500 1.1rem var(--ralewayFont);
    color: #00000099;
    transition: all 0.4s;
    pointer-events: none;
  }
`;
