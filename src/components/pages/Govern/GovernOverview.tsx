import React, { FC } from 'react';
import styled from 'styled-components';
import { ProtocolOverview } from './ProtocolOverview';

import { IncentivisedVotingLockupAtBlockProvider } from '../Stats/IncentivisedVotingLockupAtBlockProvider';
import { StatsDataProvider } from '../Stats/StatsDataProvider';
import { StakeProvider } from '../Stake/StakeProvider';

import { useAccount } from '../../../context/UserProvider';
import { ViewportWidth } from '../../../theme';

const Container = styled.div`
  grid-column: 1 / 6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: ${ViewportWidth.xl}) {
    flex-direction: row;
  }
`;

export const GovernOverview: FC = () => {
  const account = useAccount();

  return (
    <IncentivisedVotingLockupAtBlockProvider>
      <StatsDataProvider>
        <StakeProvider key={account}>
          <Container>
            <ProtocolOverview />
          </Container>
        </StakeProvider>
      </StatsDataProvider>
    </IncentivisedVotingLockupAtBlockProvider>
  );
};
