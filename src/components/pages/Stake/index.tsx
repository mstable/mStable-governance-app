import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as StakeIcon } from '../../icons/circle/lock.svg';
import { TransactionForm } from '../../forms/TransactionForm';
import { StakeInput } from './StakeInput';
import { StakeProvider, useStakeState } from './StakeProvider';

const StakeForm: FC<{}> = () => {
  const { valid } = useStakeState();
  return (
    <TransactionForm
      confirmLabel='Confirm Deposit and Lockup'
      input={<StakeInput />}
      valid={valid}
    />
  );
};

export const Stake: FC<{}> = () => {
  return (
    <div>
      <PageHeader
        icon={<StakeIcon />}
        title="STAKE"
        subtitle="Stake your MTA to participate in mStable protocol governance"
      />
      <StakeProvider>
        <StakeForm />
      </StakeProvider>
    </div>
  )
};



