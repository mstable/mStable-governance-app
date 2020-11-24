import React, { FC } from 'react';
import styled from 'styled-components';
import { ViewportWidth } from '../../../theme';

const Container = styled.div`
  grid-column: 1 / 6;
  height: 150px;
  background: blue;

  @media (min-width: ${ViewportWidth.l}) {
    grid-column: 1 / 4;
  }
`;

export const GovernFeed: FC = () => {
  return <Container />;
};
