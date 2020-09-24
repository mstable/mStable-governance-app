import React, { FC } from 'react';
import { useStakeState } from './StakeProvider';
import { TransactionType } from './types';
import { CountUp } from '../../core/CountUp';

export const ExitConfirm: FC<{}> = () => {
    const {
        data: { incentivisedVotingLockup, metaToken },
        transactionType
    } = useStakeState();
    const balance = incentivisedVotingLockup?.userStakingBalance;
    const txCheck = transactionType === TransactionType.Withdraw;
    const canUnlock = incentivisedVotingLockup?.userLockup?.lockTime as number > Date.now();

    return balance && txCheck && metaToken && canUnlock ? (
        <div>
            You are withdrawing{' '}
            <CountUp end={balance?.simpleRounded} suffix={` ${metaToken.symbol}`} />{' '}
        </div>
    ) : null;
};