import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as GovernanceIcon } from '../../icons/circle/analytics.svg';
import { TransactionForm } from '../../forms/TransactionForm';
import { GovernanceInput } from './GovernanceInput';
import { GovernanceProvider } from './GovernanceProvider';

const GovernanceForm: FC<{}> = () => {

  return (
    <TransactionForm
      confirmLabel='Confirm Deposit and Lockup'
      input={<GovernanceInput />}
      // eslint-disable-next-line react/jsx-boolean-value
      valid={true}
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



