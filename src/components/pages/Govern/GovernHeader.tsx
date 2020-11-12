import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding-top: 160px;
  padding-bottom: 96px;
  grid-column: 1 / 4 !important;
  background: red;
  margin: 0px 24px;
`;

export const GovernHeader: FC = () => {
  return <Container />;
};
