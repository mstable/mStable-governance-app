import React, { FC } from 'react';
import styled from 'styled-components';
import { GovernStats } from './GovernStats';

import { IncentivisedVotingLockupAtBlockProvider } from '../Stats/IncentivisedVotingLockupAtBlockProvider';
import { StatsDataProvider } from '../Stats/StatsDataProvider';
import { StakeProvider } from '../Stake/StakeProvider';

import { useAccount } from '../../../context/UserProvider';

const Container = styled.div`
  grid-column: 1 / 6;
  display: flex;
  flex-direction: column;
`;

export const GovernOverview: FC = () => {
  const account = useAccount();

  return (
    <IncentivisedVotingLockupAtBlockProvider>
      <StatsDataProvider>
        <StakeProvider key={account}>
          <Container>
            <GovernStats />
          </Container>
        </StakeProvider>
      </StatsDataProvider>
    </IncentivisedVotingLockupAtBlockProvider>
  );
};
