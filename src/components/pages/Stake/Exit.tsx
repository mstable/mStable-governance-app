import React, { FC, useEffect } from 'react';

import styled from 'styled-components';
import { Interfaces } from '../../../types';
import { TransactionForm } from '../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { H3 } from '../../core/Typography';
import { StakeAmountInput } from '../../forms/StakeAmountInput';
import { useStakeState, useStakeContract } from './StakeProvider';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

const Input: FC<{}> = () => {
  return (
    <Row>
      <H3>Withdraw stake or exit</H3>
      <StakeAmountInput />
    </Row>
  );
};

const StyledTransactionForm = styled(TransactionForm)`
  h3 {
    border-top: 0;
  }
`;

const ExitForm: FC<{}> = () => {
  const {
    valid,
  } = useStakeState();
  const setFormManifest = useSetFormManifest();
  const contract = useStakeContract();

  useEffect(() => {
    if (valid && contract) {
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
  }, [setFormManifest, valid, contract]);

  return (
    <StyledTransactionForm
      confirmLabel='Withdraw'
      confirm={<div>TODO</div>}
      input={<Input />}
      transactionsLabel="Transactions"
      valid={valid}
    />
  );
};

export const Exit: FC<{}> = () => (
  <FormProvider formId="exit">
    <ExitForm />
  </FormProvider>
);
