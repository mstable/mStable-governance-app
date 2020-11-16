import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  grid-column: 1 / 6;
  height: 150px;
  background: green;
`;

export const GovernStats: FC = () => {
  return <Container />;
};
