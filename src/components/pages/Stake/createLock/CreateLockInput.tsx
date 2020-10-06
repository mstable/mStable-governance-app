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
import { fromUnix } from '../../../../utils/time';

const AmountContainer = styled.div`
  > :first-child {
    text-align: right;
    padding: 4px 8px;
  }

  > :last-child {
    margin-bottom: 32px;
  }
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

  const duration = useFormatDays(lockupDays);

  return (
    <>
      <div>
        <H3>
          <Tooltip tip="Units of MTA to lock up">Stake amount</Tooltip>
        </H3>

        {data.metaToken && data.incentivisedVotingLockup ? (
          <AmountContainer>
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
                address: data.metaToken.address as string,
              }}
              approval={{
                spender: data.incentivisedVotingLockup.address,
              }}
              error={error}
              valid={!!(amountFormValue && !error)}
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
          </AmountContainer>
        ) : (
          <Skeleton />
        )}
      </div>
      <FormRow>
        <H3>
          <Tooltip tip="Period of time to stake for (rounded to the nearest week)">
            Stake lockup period
          </Tooltip>
        </H3>
        {data.incentivisedVotingLockup ? (
          <RangeInput
            min={data.incentivisedVotingLockup.lockTimes.min}
            step={7}
            max={data.incentivisedVotingLockup.lockTimes.max}
            value={Math.max(
              lockupDays,
              data.incentivisedVotingLockup.lockTimes.min,
            )}
            onChange={setLockupDays}
            startLabel="Today"
            endLabel="End date"
            onSetMax={setMaxLockupDays}
          >
            <div>{duration}</div>
            <div>
              {unlockTime ? format(fromUnix(unlockTime), 'dd-MM-yyyy') : '-'}
            </div>
          </RangeInput>
        ) : (
          <Skeleton />
        )}
      </FormRow>
    </>
  );
};
