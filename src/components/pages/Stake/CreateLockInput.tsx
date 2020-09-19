import React, { FC } from 'react';
import format from 'date-fns/format';
import Skeleton from 'react-loading-skeleton';

import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { RangeInput } from '../../forms/RangeInput';
import { Tooltip } from '../../core/ReactTooltip';
import { InlineTokenAmountInput } from '../../forms/InlineTokenAmountInput';
import { useStakeDispatch, useStakeState } from './StakeProvider';

export const CreateLockInput: FC = () => {
  const {
    lockupAmount: { formValue: amountFormValue, amount },
    lockupPeriod: { formValue: lockupDays, unlockTime },
    error,
    data,
  } = useStakeState();
  const { setLockupAmount, setLockupDays } = useStakeDispatch();

  return (
    <>
      <FormRow>
        <H3>
          <Tooltip tip="test">Deposit Amount</Tooltip>
        </H3>
        {/* TODO: add balances label */}
        {data.metaToken && data.incentivisedVotingLockup ? (
          <InlineTokenAmountInput
            amount={{
              value: amount,
              formValue: amountFormValue,
              handleChange: setLockupAmount,
              // TODO: handleSetMax
            }}
            token={{
              address: data.metaToken.address,
            }}
            approval={{
              spender: data.incentivisedVotingLockup.address,
            }}
            error={error}
          />
        ) : (
          <Skeleton />
        )}
      </FormRow>
      <FormRow>
        <H3>
          <Tooltip tip="test">Lock up deposit</Tooltip>
        </H3>
        <RangeInput
          min={0}
          max={365}
          value={lockupDays}
          onChange={setLockupDays}
          startLabel="Today"
          endLabel="One Year"
        >
          <div>{lockupDays} Days</div>
          <div>
            {unlockTime ? format(unlockTime * 1000, 'dd-MM-yyyy') : '-'}
          </div>
        </RangeInput>
      </FormRow>
    </>
  );
};
