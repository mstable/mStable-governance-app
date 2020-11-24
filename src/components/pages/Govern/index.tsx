import React, { FC } from 'react';
import styled from 'styled-components';

import { GovernHeader as Header } from './GovernHeader';
import { GovernOverview as Overview } from './GovernOverview';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  grid-row-gap: ${({ theme }) => theme.spacing.l};
  grid-column-gap: ${({ theme }) => theme.spacing.l};
`;

export const Govern: FC<{}> = () => (
  <Wrapper>
    <Header />
    <Overview />
  </Wrapper>
);
