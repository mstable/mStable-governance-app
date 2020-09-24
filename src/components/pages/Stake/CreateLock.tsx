import React, { FC, useEffect } from 'react';
import format from 'date-fns/format';

import Skeleton from 'react-loading-skeleton';
import { TransactionForm } from '../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../forms/TransactionForm/FormProvider';
import { Interfaces } from '../../../types';
import { BigDecimal } from '../../../web3/BigDecimal';

import { CreateLockInput } from './CreateLockInput';
import { useStakeContract, useStakeState } from './StakeProvider';
import { TransactionType } from './types';
import { CreateLockConfirm } from './CreateLockConfirm';
import { Protip } from '../../core/Protip';

// const TX_TYPES = {
//   [TransactionType.CreateLock]: {
//     confirmLabel: 'Lock up and stake MTA',
//     input: <CreateLockInput />,
//     confirm: <div>TODO confirm for create lock</div>,
//   },
//   [TransactionType.Claim]: {
//     confirmLabel: 'Claim rewards',
//     input: <div>TODO input for claim rewards</div>,
//     confirm: <div>TODO confirm for claim rewards</div>,
//   },
//   [TransactionType.Withdraw]: {
//     confirmLabel: 'Withdraw unlocked MTA',
//     input: <div>TODO input for withdraw</div>,
//     confirm: <div>TODO confirm for withdraw</div>,
//   },
//   [TransactionType.IncreaseLockAmount]: {
//     confirmLabel: 'Increase locked amount',
//     input: <div>TODO input for increase lock amount</div>,
//     confirm: <div>TODO confirm for increase lock amount</div>,
//   },
//   [TransactionType.IncreaseLockTime]: {
//     confirmLabel: 'Increase lockup time',
//     input: <div>TODO input for increase lock time</div>,
//     confirm: <div>TODO confirm for increase lock time</div>,
//   },
// };

const StakeForm: FC = () => {
  const {
    lockupAmount: { amount },
    lockupPeriod: { unlockTime },
    transactionType,
    valid,
    data,
  } = useStakeState();
  const setFormManifest = useSetFormManifest();
  const contract = useStakeContract();
  const { incentivisedVotingLockup } = data;

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

        default:
          break;
      }
    }

    return setFormManifest(null);
  }, [amount, transactionType, unlockTime, valid, setFormManifest, contract]);

  return incentivisedVotingLockup ? (
    !incentivisedVotingLockup.userStakingBalance ||
    incentivisedVotingLockup.userStakingBalance?.simple === 0 ? (
      <TransactionForm
        confirmLabel="Lock up and stake MTA"
        confirm={<CreateLockConfirm />}
        input={<CreateLockInput />}
        valid={valid}
      />
    ) : (
      <>
        <Protip emoji="😊" title="You have already staked!">
          <br />
          Your stake of {incentivisedVotingLockup.userLockup?.value.simple} MTA
          will unlock on{' '}
          {incentivisedVotingLockup.userLockup?.lockTime
            ? format(
                incentivisedVotingLockup.userLockup?.lockTime * 1000,
                'dd-MM-yyyy',
              )
            : null}
          <br />
          <br />
          Whilst it's possible to both extend your lockup time and increase
          lockup amount, this hasn't been added to the UI yet - hold tight!
        </Protip>
        <br />
      </>
    )
  ) : (
    <Skeleton />
  );
};

export const CreateLock: FC = () => {
  return (
    <>
      <FormProvider formId="stake">
        <StakeForm />
      </FormProvider>
    </>
  );
};
