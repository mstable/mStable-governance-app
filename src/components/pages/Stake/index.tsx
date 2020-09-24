import React, { FC } from 'react';
import { StakeForms } from './StakeForms';
import { StakeProvider } from './StakeProvider';
import { PageHeader } from '../PageHeader';
import { StakeInfo } from './StakeInfo';
import { ReactComponent as StakeIcon } from '../../icons/circle/lock.svg';

// const Container = styled.div`
//   display: inline-flex;
//   flex-direction: column;
//   padding-bottom: 20px;
// `;

export const StakeTabs: FC = () => {
  return (
    <StakeProvider>
      <PageHeader
        icon={<StakeIcon />}
        title="Stake"
        subtitle="Stake your MTA to participate in mStable protocol governance"
      />
      <StakeInfo />
      <StakeForms />
    </StakeProvider>
  );
};
