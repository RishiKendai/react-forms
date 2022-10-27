import React from 'react';

import styled from 'styled-components';

export default function Option({ value, index, setOptions, setOptionsBlur }) {
  return (
    <Component>
      <div className="option-div">
        <input
          className="option"
          type="text"
          onChange={(e) => setOptions(e.target.value, index)}
          onBlur={(e) => setOptionsBlur(e.target.value, index)}
          value={value}
        />
      </div>
    </Component>
  );
}

const Component = styled.div`
  .option {
    border: none;
    outline: none;
    padding: 7px;
    font: 400 1.12rem var(--openSansFont);
    color: #323232;
    border-radius: 4px;
    background: hsl(0 100% 100% / 0.2);
    box-shadow: 0 0 8px hsl(0 0% 0% / 0.12);
    border-bottom: 2px solid hsl(265 100% 49%);
    margin-bottom: .5rem;
  }
`;
