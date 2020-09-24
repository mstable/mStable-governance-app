import React, { FC } from 'react';
import format from 'date-fns/format';
import Skeleton from 'react-loading-skeleton';

import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { RangeInput } from '../../forms/RangeInput';
import { Tooltip } from '../../core/ReactTooltip';
import { Protip } from '../../core/Protip';
import { ExternalLink } from '../../core/ExternalLink';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { useStakeDispatch, useStakeState } from './StakeProvider';

export const CreateLockInput: FC = () => {
  const {
    lockupAmount: { formValue: amountFormValue, amount },
    lockupPeriod: { formValue: lockupDays, unlockTime },
    error,
    data,
  } = useStakeState();
  // const { end } = data.incentivisedVotingLockup;
  const {
    setLockupAmount,
    setLockupDays,
    setMaxLockupAmount,
    setMaxLockupDays,
  } = useStakeDispatch();

  return (
    <>
      <FormRow>
        <H3>
          <Tooltip tip="test">Deposit Amount</Tooltip>
        </H3>
        {/* TODO: add balances label */}
        {data.metaToken && data.incentivisedVotingLockup ? (
          <>
            <TokenAmountInput
              needsUnlock
              amountValue={amountFormValue}
              error={error}
              exactDecimals
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
                <ExternalLink href="https://balancer.exchange/#/swap">
                  Get MTA tokens on Balancer
                </ExternalLink>
              </Protip>
            ) : null}
          </>
        ) : (
          <Skeleton />
        )}
      </FormRow>
      <FormRow>
        <H3>
          <Tooltip tip="test">Lock up deposit</Tooltip>
        </H3>
        {data.incentivisedVotingLockup && lockupDays > 0 && (
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
            <div>{lockupDays / 7} Weeks</div>
            <div>
              {unlockTime ? format(unlockTime * 1000, 'dd-MM-yyyy') : '-'}
            </div>
          </RangeInput>
        )}
      </FormRow>
    </>
  );
};
