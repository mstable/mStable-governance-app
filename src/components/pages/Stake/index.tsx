import React, { FC } from 'react';
import styled from 'styled-components';

import { StakeForms } from './StakeForms';
import { StakeProvider } from './StakeProvider';
import { PageHeader } from '../PageHeader';
import { StakeInfo } from './StakeInfo';
import { ReactComponent as StakeIcon } from '../../icons/circle/lock.svg';
import { Protip } from '../../core/Protip';
import { ExternalLink } from '../../core/ExternalLink';
import { useAccount } from '../../../context/UserProvider';

const StyledProtip = styled(Protip)`
  font-size: 12px;
`;

export const StakeTabs: FC = () => {
  // Use a key to remount the component when the account changes
  const account = useAccount();
  return (
    <StakeProvider key={account}>
      <PageHeader
        icon={<StakeIcon />}
        title="Stake"
        subtitle="Stake your MTA to participate in mStable protocol governance"
      >
        <StyledProtip emoji="💪" title="Earning power calculation">
          Wondering how your earning power is calculated?{' '}
          <ExternalLink href="https://medium.com/mstable/mta-staking-v1-voting-weights-and-rewards-3a25d1d42124">
            Read more here
          </ExternalLink>
        </StyledProtip>
      </PageHeader>
      <StakeInfo />
      <StakeForms />
    </StakeProvider>
  );
};
