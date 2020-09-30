import React, { FC } from 'react';
import format from 'date-fns/format';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { H3, H4 } from '../../../core/Typography';
import { RangeInput } from '../../../forms/RangeInput';
import { Tooltip } from '../../../core/ReactTooltip';
import { Protip } from '../../../core/Protip';
import { ExternalLink } from '../../../core/ExternalLink';
import { useFormatDays } from '../../../../utils/hooks';
import { InlineTokenAmountInput } from '../../../forms/InlineTokenAmountInput';
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

  const {
    setLockupAmount,
    setLockupDays,
    setMaxLockupAmount,
    setMaxLockupDays,
  } = useStakeDispatch();

  const duration = useFormatDays(lockupDays);
  return (
    <>
      <div>
        {metaToken && incentivisedVotingLockup ? (
          <AmountContainer>
            {transactionType === TransactionType.IncreaseLockAmount &&
              <div>
                <TooltipContainer>
                  <H3>
                    <Tooltip tip="Units of MTA to lock up">Stake amount</Tooltip>
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
            }
            {metaToken && metaToken?.balance.simple < 1000 ? (
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
      {transactionType === TransactionType.IncreaseLockTime &&
        <div>
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
              value={lockupDays || incentivisedVotingLockup.lockTimes.min}
              onChange={setLockupDays}
              startLabel="Today"
              endLabel="End date"
              onSetMax={setMaxLockupDays}
            >
              <div>{duration}</div>
              <div>
                {unlockTime ? format(unlockTime * 1000, 'dd-MM-yyyy') : '-'}
              </div>
            </RangeInput>
          ) : (
              <Skeleton />
            )}
        </div>
      }
    </>
  );
};