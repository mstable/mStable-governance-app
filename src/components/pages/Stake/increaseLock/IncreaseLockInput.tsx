import React, { FC } from 'react';
import format from 'date-fns/format';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { FormRow } from '../../../core/Form';
import { H3, H4 } from '../../../core/Typography';
import { RangeInput } from '../../../forms/RangeInput';
import { Tooltip } from '../../../core/ReactTooltip';
import { Protip } from '../../../core/Protip';
import { ExternalLink } from '../../../core/ExternalLink';
import { useFormatDays } from '../../../../utils/hooks';
import { InlineTokenAmountInput } from '../../../forms/InlineTokenAmountInput';
import { useStakeDispatch, useStakeState } from '../StakeProvider';
import { ToggleInput } from '../../../forms/ToggleInput';
import { TransactionType } from '../types';
import { Color } from '../../../../theme';

const AmountContainer = styled.div`
  > :first-child {
    text-align: right;
    padding: 4px 8px;
  }

  > :last-child {
    margin-bottom: 32px;
  }
`;
const TransactionTypeRow = styled(FormRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.l} 0`};

  > * {
    padding: 0 8px;
  }
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
    toggleTransactionType
  } = useStakeDispatch();

  const duration = useFormatDays(lockupDays);
  return (
    <>
      <div>
        <H3>
          <Tooltip tip="Units of MTA to lock up">Stake amount</Tooltip>
        </H3>

        {metaToken && incentivisedVotingLockup ? (
          <AmountContainer>
            <div>
              <H4>MTA Balance</H4>
            </div>
            <TransactionTypeRow>
              <div>Increase Amount</div>
              <ToggleInput
                onClick={toggleTransactionType}
                checked={transactionType === TransactionType.IncreaseLockTime}
                enabledColor={Color.blue}
                disabledColor={Color.green}
              />
              <div>Increase Time</div>
            </TransactionTypeRow>
            {transactionType === TransactionType.IncreaseLockAmount &&
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
        </FormRow>
      }
    </>
  );
};
