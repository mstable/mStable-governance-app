import React, { FC } from 'react';
import { useStakeState, useRewardsEarned } from '../StakeProvider';
import { TransactionType } from '../types';
import { CountUp } from '../../../core/CountUp';

export const ClaimConfirm: FC<{}> = () => {
  const {
    data: { metaToken },
    transactionType,
  } = useStakeState();
  const txCheck = transactionType === TransactionType.Claim;
  const rewards = useRewardsEarned();
  // eslint-disable-next-line no-console
  console.log('rewards', rewards);
  return rewards?.rewards?.exact.gt(0) && metaToken && txCheck ? (
    <div>
      You are claiming{' '}
      <CountUp
        end={rewards?.rewards?.simple}
        decimals={6}
        suffix={` ${metaToken.symbol}`}
      />{' '}
    </div>
  ) : null;
};
