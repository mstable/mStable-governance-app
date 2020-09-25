import React, { FC, useMemo } from 'react';
import format from 'date-fns/format';
import formatDuration from 'date-fns/formatDuration';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { FormRow } from '../../../core/Form';
import { H3 } from '../../../core/Typography';
import { RangeInput } from '../../../forms/RangeInput';
import { Tooltip } from '../../../core/ReactTooltip';
import { Protip } from '../../../core/Protip';
import { ExternalLink } from '../../../core/ExternalLink';
import { TokenAmountInput } from '../../../forms/TokenAmountInput';
import { useStakeDispatch, useStakeState } from '../StakeProvider';

const StyledTransactionForm = styled(FormRow)`
  border-top: 0;
`;

export const CreateLockInput: FC = () => {
  const {
    lockupAmount: { formValue: amountFormValue, amount },
    lockupPeriod: { formValue: lockupDays, unlockTime },
    error,
    data,
  } = useStakeState();
  const {
    setLockupAmount,
    setLockupDays,
    setMaxLockupAmount,
    setMaxLockupDays,
  } = useStakeDispatch();

  const duration = useMemo<string>(() => {
    const weeks = Math.floor(lockupDays / 7);
    const days = Math.floor(lockupDays - weeks * 7);
    return formatDuration(
      { weeks, days },
      { format: ['weeks', 'days'], zero: false },
    );
  }, [lockupDays]);

  return (
    <>
      <StyledTransactionForm>
        <H3>
          <Tooltip tip="Units of MTA to lock up">Stake Amount</Tooltip>
        </H3>

        {data.metaToken && data.incentivisedVotingLockup ? (
          <>
            <TokenAmountInput
              needsUnlock
              amountValue={amountFormValue}
              error={error}
              exactDecimals={false}
              name="stake"
              spender={data.incentivisedVotingLockup.address}
              onChangeAmount={setLockupAmount}
              onSetMax={setMaxLockupAmount}
              tokenAddresses={[data.metaToken.address as string]}
              tokenDisabled
              tokenValue={data.metaToken.address || null}
              approveAmount={amount}
            />
            {data.metaToken && data.metaToken?.balance.simple < 1000 ? (
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
          </>
        ) : (
          <Skeleton />
        )}
      </StyledTransactionForm>
      <FormRow>
        <H3>
          <Tooltip tip="Length of time to stake for (rounded to the nearest week)">
            Stake lockup length
          </Tooltip>
        </H3>
        {data.incentivisedVotingLockup && lockupDays > 0 ? (
          <RangeInput
            min={data.incentivisedVotingLockup.lockTimes.min}
            step={7}
            max={data.incentivisedVotingLockup.lockTimes.max}
            value={lockupDays}
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
    </>
  );
};
