import React, { FC } from 'react';
import styled from 'styled-components';

import { GovernHeader as Header } from './GovernHeader';
import { GovernStats as Stats } from './GovernStats';
import { GovernFeed as Feed } from './GovernFeed';
import { GovernOnboarding as Onboarding } from './GovernOnboarding';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  grid-row-gap: ${({ theme }) => theme.spacing.l};
  grid-column-gap: ${({ theme }) => theme.spacing.l};
`;

export const Govern: FC<{}> = () => {
  return (
    <Wrapper>
      <Header />
      <Stats />
      <Feed />
      <Onboarding />
    </Wrapper>
  );
};
