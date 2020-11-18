import React, { FC } from 'react';
import styled from 'styled-components';
import { GovernStats as Stats } from './GovernStats';
import { GovernDAO as DAO } from './GovernDAO';

import { IncentivisedVotingLockupAtBlockProvider } from '../Stats/IncentivisedVotingLockupAtBlockProvider';
import { StatsDataProvider } from '../Stats/StatsDataProvider';
import { StakeProvider } from '../Stake/StakeProvider';

import { useAccount } from '../../../context/UserProvider';

const Container = styled.div`
  grid-column: 1 / 6;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const GovernOverview: FC = () => {
  const account = useAccount();

  return (
    <IncentivisedVotingLockupAtBlockProvider>
      <StatsDataProvider>
        <StakeProvider key={account}>
          <Container>
            <Stats />
            <DAO />
          </Container>
        </StakeProvider>
      </StatsDataProvider>
    </IncentivisedVotingLockupAtBlockProvider>
  );
};
