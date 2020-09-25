import React, { FC, useEffect } from 'react';

import { Interfaces } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { useStakeContract, useRewardsEarned } from '../StakeProvider';
import { ClaimInput } from './ClaimInput';

const Form: FC<{}> = () => {
  const rewards = useRewardsEarned();
  const contract = useStakeContract();
  const setFormManifest = useSetFormManifest();
  const valid = !!rewards.rewards?.exact.gt(0);

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
      input={<ClaimInput />}
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
