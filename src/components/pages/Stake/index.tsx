/* eslint-disable consistent-return */
import React, { FC, useEffect } from 'react';

import { ReactComponent as StakeIcon } from '../../icons/circle/lock.svg';
import { TransactionForm } from '../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { Interfaces } from '../../../types';
import { BigDecimal } from '../../../web3/BigDecimal';

import { PageHeader } from '../PageHeader';
import { CreateLockInput } from './CreateLockInput';
import {
  StakeProvider,
  useStakeContract,
  useStakeState,
} from './StakeProvider';
import { TransactionType } from './types';
import { StakeInfo } from './StakeInfo';

const TX_TYPES = {
  [TransactionType.CreateLock]: {
    confirmLabel: 'Lock up and stake MTA',
    input: <CreateLockInput />,
    confirm: <div>TODO confirm for create lock</div>,
  },
  [TransactionType.Claim]: {
    confirmLabel: 'Claim rewards',
    input: <div>TODO input for claim rewards</div>,
    confirm: <div>TODO confirm for claim rewards</div>,
  },
  [TransactionType.Withdraw]: {
    confirmLabel: 'Withdraw unlocked MTA',
    input: <div>TODO input for withdraw</div>,
    confirm: <div>TODO confirm for withdraw</div>,
  },
  [TransactionType.IncreaseLockAmount]: {
    confirmLabel: 'Increase locked amount',
    input: <div>TODO input for increase lock amount</div>,
    confirm: <div>TODO confirm for increase lock amount</div>,
  },
  [TransactionType.IncreaseLockTime]: {
    confirmLabel: 'Increase lockup time',
    input: <div>TODO input for increase lock time</div>,
    confirm: <div>TODO confirm for increase lock time</div>,
  },
};

const StakeForm: FC = () => {
  const {
    lockupAmount: { amount },
    lockupPeriod: { unlockTime },
    transactionType,
    valid,
  } = useStakeState();
  const setFormManifest = useSetFormManifest();
  const contract = useStakeContract();

  useEffect(() => {
    if (valid && contract) {
      switch (transactionType) {
        case TransactionType.CreateLock:
          return setFormManifest<
            Interfaces.IncentivisedVotingLockup,
            'createLock'
          >({
            fn: 'createLock',
            args: [(amount as BigDecimal).exact, unlockTime as number],
            contract,
          });

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

        case TransactionType.Withdraw:
          return setFormManifest<
            Interfaces.IncentivisedVotingLockup,
            'withdraw'
          >({
            fn: 'withdraw',
            args: [],
            contract,
          });

        case TransactionType.Claim:
          return setFormManifest<
            Interfaces.IncentivisedVotingLockup,
            'claimReward'
          >({
            fn: 'claimReward',
            args: [],
            contract,
          });

        default:
          break;
      }
    }

    setFormManifest(null);
  }, [amount, transactionType, unlockTime, valid, setFormManifest, contract]);

  const { confirmLabel, confirm, input } = TX_TYPES[transactionType];

  return (
    <TransactionForm
      confirmLabel={confirmLabel}
      confirm={confirm}
      input={input}
      valid={valid}
    />
  );
};

const StakeContent: FC = () => {
  return (
    <>
      <PageHeader
        icon={<StakeIcon />}
        title="Stake"
        subtitle="Stake your MTA to participate in mStable protocol governance"
      />
      <StakeInfo />
      <FormProvider formId="stake">
        <StakeForm />
      </FormProvider>
    </>
  );
};

export const Stake: FC = () => {
  return (
    <StakeProvider>
      <StakeContent />
    </StakeProvider>
  );
};
