import React from 'react';

import styled from 'styled-components';
export default function Error() {
  return (
    <Component>
        <h4>404 Not Found</h4>
        <div className="content">
          <h3>The page you requested is currently unavailable</h3>
        </div>
    </Component>
  );
}
const Component = styled.div`
  height: 100vh;
  width: 100%;
  background: #282828;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  h4 {
    font: 600 2.3rem var(--MontserratFont);
    color: hsl(0 100% 100% / 0.89);
    margin-bottom: 2rem;
  }
  .content {
    h3 {
      font: 600 1.6rem var(--poppinsFont);
      color: hsl(0 100% 100% / 0.49);
    }
  }
`;
