import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  grid-column: 1 / 6;
  height: 600px;
  background: red;
`;

export const GovernHeader: FC = () => {
  return <Container />;
};