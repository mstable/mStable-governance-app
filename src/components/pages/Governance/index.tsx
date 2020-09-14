import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as GovernanceIcon } from '../../icons/circle/analytics.svg';
import { TransactionForm } from '../../forms/TransactionForm';
import { GovernanceInput } from './GovernanceInput';
import { GovernanceProvider, useGovernanceState } from './GovernanceProvider';

const GovernanceForm: FC<{}> = () => {
  const { valid } = useGovernanceState();
  return (
    <TransactionForm
      confirmLabel='Confirm Deposit and Lockup'
      input={<GovernanceInput />}
      valid={valid}
    />
  );
};

export const Governance: FC<{}> = () => {
  return (
    <div>
      <PageHeader
        icon={<GovernanceIcon />}
        title="GOVERNANCE"
        subtitle="Stake your MTA to participate in mStable protocol governance"
      />
      <GovernanceProvider>
        <GovernanceForm />
      </GovernanceProvider>
    </div>
  )
};



