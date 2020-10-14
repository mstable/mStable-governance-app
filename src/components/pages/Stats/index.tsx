import React, { FC } from 'react';

import { ReactComponent as StatsIcon } from '../../icons/circle/analytics.svg';
import { PageHeader } from '../PageHeader';
import { StatsContent } from './StatsContent';
import { StatsDataProvider } from './StatsDataProvider';
import { IncentivisedVotingLockupAtBlockProvider } from './IncentivisedVotingLockupAtBlockProvider';

export const Stats: FC = () => {
  return (
    <IncentivisedVotingLockupAtBlockProvider>
      <StatsDataProvider>
        <PageHeader
          icon={<StatsIcon />}
          title="Statistics"
          subtitle="Key metrics and voting power statistics"
        />
        <StatsContent />
      </StatsDataProvider>
    </IncentivisedVotingLockupAtBlockProvider>
  );
};
