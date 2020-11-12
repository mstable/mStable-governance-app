import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing.l};
  grid-column: 1 / 4;
  height: 150px;
  background: blue;
`;

export const GovernFeed: FC = () => {
  return <Container />;
};
