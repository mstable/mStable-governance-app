import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding-top: 160px;
  padding-bottom: 96px;
  grid-column: 1 / 4 !important;
  background: blue;
`;

export const GovernFeed: FC = () => {
  return <Container />;
};
