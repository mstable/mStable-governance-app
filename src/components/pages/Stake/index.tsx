import React, { FC } from 'react';
import styled from 'styled-components';
import { StakeForms } from './StakeForms';
import { StakeProvider } from './StakeProvider';
import { PageHeader } from '../PageHeader';
import { StakeInfo } from './StakeInfo';
import { ReactComponent as StakeIcon } from '../../icons/circle/lock.svg';
import { Protip } from '../../core/Protip';

const Container = styled.div`
display: inline-flex;
flex-direction: column;
padding-bottom: 20px;
`;

export const StakeTabs: FC = () => {
  return (
    <StakeProvider>
      <Container>
        <Protip emoji="⚠️" title="Take care of your funds!">
          Your funds will have to be withdrawn once we migrate to staking V2.
      </Protip>
      </Container>
      <PageHeader
        icon={<StakeIcon />}
        title="Stake"
        subtitle="Stake your MTA to participate in mStable protocol governance"
      />
      <StakeForms />
      <StakeInfo />
    </StakeProvider>
  );
};
