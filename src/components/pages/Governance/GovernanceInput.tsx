import React, { FC, useMemo } from 'react';
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { useGovernanceDispatch, useGovernanceState } from './GovernanceProvider';
import { RangeInput } from '../../forms/RangeInput';

const now = new Date()

export const GovernanceInput: FC<{}> = () => {
  const {
    formValue,
    lockUpPeriod,
    error,
    data
  } = useGovernanceState();
  const {
    setVoteAmount,
    setLockUpPeriod
  } = useGovernanceDispatch();

  const formattedDate = useMemo(() => {
    return format(addDays(now, lockUpPeriod), "dd-MM-yyyy")
  }, [lockUpPeriod]);

  return (
    <>
      <FormRow>
        <H3>
          Deposit Amount
        </H3>
        <TokenAmountInput
          tokenValue={data.metaToken?.address || null}
          tokenAddresses={data.metaToken?.address ? [data.metaToken.address] : []}
          name='stake'
          onChangeAmount={setVoteAmount}
          amountValue={formValue || null}
          error={error}
        />
      </FormRow>
      <FormRow>
        <H3>
          Lock up deposit
        </H3>
        <RangeInput min={0} max={365} value={lockUpPeriod} onChange={setLockUpPeriod} startLabel='Today' endLabel='1 Year'>
          <div>
            {lockUpPeriod} Days
            </div>
          <div>
            ({formattedDate})
            </div>
        </RangeInput>
      </FormRow >
    </>
  );
};

