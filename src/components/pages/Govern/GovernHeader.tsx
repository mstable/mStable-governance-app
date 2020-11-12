import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 300px;
  grid-column: 1 / 4;
  background: red;
`;

export const GovernHeader: FC = () => {
  return <Container />;
};
