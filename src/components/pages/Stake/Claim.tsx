import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

import { Interfaces } from '../../../types';
import { TransactionForm } from '../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { CountUp } from '../../core/CountUp';
import { H3 } from '../../core/Typography';
import { useStakeContract, useStakeState } from './StakeProvider';

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;

const Input: FC<{}> = () => {
  // TODO add rewards state

  return (
    <Row>
      <H3>Claim rewards</H3>
      <div>
        <>
          Claim{' '}
          <CountUp end={10} />
        </>
      </div>
    </Row>
  );
};

const Form: FC<{}> = () => {

  // TODO add rewards state
  const {
    valid,
  } = useStakeState();
  const setFormManifest = useSetFormManifest();
  const contract = useStakeContract();

  useEffect(() => {
    if (valid && contract) {
      return setFormManifest<
        Interfaces.IncentivisedVotingLockup,
        'claimReward'
      >({
        fn: 'claimReward',
        args: [],
        contract,
      });
    }
    return setFormManifest(null);
  }, [setFormManifest, valid, contract]);

  return (
    <TransactionForm
      confirmLabel="Claim"
      input={<Input />}
      confirm={<div>TODO</div>}
      transactionsLabel="Claim transactions"
      valid={valid}
    />
  );
};

export const Claim: FC<{}> = () => (
  <FormProvider formId="claim">
    <Form />
  </FormProvider>
);
