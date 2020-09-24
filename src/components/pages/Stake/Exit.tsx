import React, { FC, useEffect } from 'react';

import styled from 'styled-components';
import { Interfaces } from '../../../types';
import { TransactionForm } from '../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { useStakeState, useStakeContract } from './StakeProvider';
import { ExitInput } from './ExitInput';
import { ExitConfirm } from './ExitConfirm';

const StyledTransactionForm = styled(TransactionForm)`
  h3 {
    border-top: 0;
  }
`;

const ExitForm: FC<{}> = () => {
  const {
    data: { incentivisedVotingLockup },
  } = useStakeState();
  const setFormManifest = useSetFormManifest();
  const contract = useStakeContract();
  const canUnlock = incentivisedVotingLockup?.userLockup?.lockTime as number > Date.now();

  useEffect(() => {
    if (canUnlock && contract) {
      return setFormManifest<
        Interfaces.IncentivisedVotingLockup,
        'withdraw'
      >({
        fn: 'withdraw',
        args: [],
        contract,
      });
    }
    return setFormManifest(null);
  }, [setFormManifest, canUnlock, contract]);

  return (
    <StyledTransactionForm
      confirmLabel='Withdraw'
      confirm={<ExitConfirm />}
      input={<ExitInput />}
      transactionsLabel="Transactions"
      valid={canUnlock}
    />
  );
};

export const Exit: FC<{}> = () => (
  <FormProvider formId="exit">
    <ExitForm />
  </FormProvider>
);
