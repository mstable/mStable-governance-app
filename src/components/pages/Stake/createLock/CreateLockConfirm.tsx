import React, { FC } from 'react';
import { useStakeState } from '../StakeProvider';
import { TransactionType } from '../types';
import { CountUp } from '../../../core/CountUp';

export const CreateLockConfirm: FC<{}> = () => {
  const {
    data: { metaToken },
    valid,
    transactionType,
    lockupAmount: { amount },
    lockupPeriod: { formValue },
  } = useStakeState();
  const txCheck = transactionType === TransactionType.CreateLock;

  return amount && valid && txCheck && metaToken ? (
    <div>
      You are staking{' '}
      <CountUp end={amount?.simpleRounded} suffix={` ${metaToken.symbol}`} />{' '}
      for {formValue} days.
    </div>
  ) : null;
};
