import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { RangeInput } from '../../../forms/RangeInput';
import { InlineTokenAmountInput } from '../../../forms/InlineTokenAmountInput';
import { H3, H4 } from '../../../core/Typography';
import { Tooltip } from '../../../core/ReactTooltip';
import { Protip } from '../../../core/Protip';
import { ExternalLink } from '../../../core/ExternalLink';
import { FormRow } from '../../../core/Form';
import { useFormatDays } from '../../../../utils/hooks';
import { formatUnix } from '../../../../utils/time';
import { useStakeDispatch, useStakeState } from '../StakeProvider';
import { TransactionType } from '../types';

const AmountContainer = styled.div`
  > :first-child {
    text-align: right;
    padding: 4px 8px;
  }

  > :last-child {
    margin-bottom: 32px;
  }
`;

const TooltipContainer = styled.div`
  display: flex;
`;

export const IncreaseLockInput: FC = () => {
  const {
    lockupAmount: { formValue: amountFormValue, amount },
    lockupPeriod: { formValue: lockupDays, unlockTime },
    error,
    data: { incentivisedVotingLockup, metaToken },
    transactionType,
  } = useStakeState();

  const { userLockup, lockTimes } = incentivisedVotingLockup || {};

  const duration = useFormatDays(lockupDays);

  const cannotIncreaseTime =
    userLockup && lockTimes && lockTimes.max <= userLockup.lockDays;

  const {
    setLockupAmount,
    setMaxLockupAmount,
    setMaxLockupDays,
    setLockupDays,
  } = useStakeDispatch();

  return (
    <>
      <div>
        {metaToken && incentivisedVotingLockup ? (
          <AmountContainer>
            {transactionType === TransactionType.IncreaseLockAmount && (
              <div>
                <TooltipContainer>
                  <H3>
                    <Tooltip tip="Units of MTA to lock up">
                      Stake amount
                    </Tooltip>
                  </H3>
                </TooltipContainer>
                <div>
                  <H4>MTA Balance</H4>
                </div>
                <InlineTokenAmountInput
                  amount={{
                    value: amount,
                    formValue: amountFormValue,
                    handleChange: setLockupAmount,
                    handleSetMax: setMaxLockupAmount,
                  }}
                  token={{
                    address: metaToken.address as string,
                  }}
                  approval={{
                    spender: incentivisedVotingLockup.address,
                  }}
                  error={error}
                  valid={!!(amountFormValue && !error)}
                />
              </div>
            )}
            {(transactionType === TransactionType.CreateLock ||
              transactionType === TransactionType.IncreaseLockAmount) &&
            metaToken &&
            metaToken?.balance.simple < 1000 ? (
              <Protip title="Need tokens to stake?">
                Get MTA tokens on{' '}
                <ExternalLink href="https://balancer.exchange/#/swap">
                  Balancer
                </ExternalLink>{' '}
                or{' '}
                <ExternalLink href="https://app.uniswap.org">
                  Uniswap
                </ExternalLink>
              </Protip>
            ) : null}
          </AmountContainer>
        ) : (
          <Skeleton />
        )}
      </div>
      {transactionType === TransactionType.IncreaseLockTime && lockupDays ? (
        cannotIncreaseTime ? (
          <Protip title="Unable to extend further">
            You are already staking for the maximum duration, and therefore
            cannot increase the lockup time with this account.
          </Protip>
        ) : (
          <FormRow>
            <H3>
              <Tooltip tip="Period of time to stake for (rounded to the nearest week)">
                Stake lockup period
              </Tooltip>
            </H3>
            {incentivisedVotingLockup ? (
              <RangeInput
                min={incentivisedVotingLockup.lockTimes.min}
                step={7}
                max={incentivisedVotingLockup.lockTimes.max}
                value={Math.max(
                  lockupDays,
                  incentivisedVotingLockup.lockTimes.min,
                )}
                onChange={setLockupDays}
                startLabel="Start"
                endLabel="End date"
                onSetMax={setMaxLockupDays}
                error={error}
              >
                <div>{duration}</div>
                <div>{unlockTime ? formatUnix(unlockTime) : '-'}</div>
              </RangeInput>
            ) : (
              <Skeleton />
            )}
          </FormRow>
        )
      ) : null}
    </>
  );
};
