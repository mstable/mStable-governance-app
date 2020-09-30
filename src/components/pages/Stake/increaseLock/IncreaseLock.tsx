import React, { FC, useEffect } from 'react';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { Interfaces } from '../../../../types';
import { BigDecimal } from '../../../../utils/BigDecimal';

import { useStakeContract, useStakeState } from '../StakeProvider';
import { IncreaseLockInput } from "./IncreaseLockInput";
import { TransactionType } from '../types';
import { CreateLockConfirm } from '../createLock/CreateLockConfirm';

const IncreaseLockForm: FC = () => {
  const {
    lockupAmount: { amount },
    lockupPeriod: { unlockTime },
    valid,
    transactionType
  } = useStakeState();
  const setFormManifest = useSetFormManifest();
  const contract = useStakeContract();

  useEffect(() => {
    if (valid && contract) {
      switch (transactionType) {
        case TransactionType.IncreaseLockAmount:
          return setFormManifest<
            Interfaces.IncentivisedVotingLockup,
            'increaseLockAmount'
          >({
            fn: 'increaseLockAmount',
            args: [(amount as BigDecimal).exact],
            contract,
          });

        case TransactionType.IncreaseLockTime:
          return setFormManifest<
            Interfaces.IncentivisedVotingLockup,
            'increaseLockLength'
          >({
            fn: 'increaseLockLength',
            args: [unlockTime as number],
            contract,
          });

        default:
          break;
      }
    }
    return setFormManifest(null);
  }, [amount, unlockTime, transactionType, valid, setFormManifest, contract]);
  return (
    <TransactionForm
      confirmLabel="Lock up and stake MTA"
      confirm={<CreateLockConfirm />}
      input={<IncreaseLockInput />}
      valid={valid}
    />
  );
};

export const IncreaseLock: FC = () => {
  return (
    <>
      <FormProvider formId="stake">
        <IncreaseLockForm />
      </FormProvider>
    </>
  );
};
