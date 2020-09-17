import React, { FC, useMemo } from 'react';
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import styled from 'styled-components';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { useStakeDispatch, useStakeState } from './StakeProvider';
import { RangeInput } from '../../forms/RangeInput';
import { TokenIcon } from '../../icons/TokenIcon';
import { Tooltip } from '../../core/ReactTooltip';

const now = new Date()

const Symbol = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;

  > :first-child {
    width: 32px;
    margin-right: 8px;
  }
`;

const Container = styled.div`
  padding-top: 20px;
`;



export const StakeInput: FC<{}> = () => {
  const {
    formValue,
    lockUpPeriod,
    error,
    data
  } = useStakeState();
  const {
    setVoteAmount,
    setLockUpPeriod
  } = useStakeDispatch();

  const formattedDate = useMemo(() => {
    return format(addDays(now, lockUpPeriod), "dd-MM-yyyy")
  }, [lockUpPeriod]);
  // eslint-disable-next-line no-console
  console.log('data', data);
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
      <FormRow>
        <H3>
          Your stake
        </H3>
        {data.metaToken &&
          <Container>
            <Symbol>
              <TokenIcon symbol={data.metaToken?.symbol} />
              <Tooltip tip='test'>
                vMTA
              </Tooltip>
            </Symbol>
            <Symbol>
              <TokenIcon symbol={data.metaToken?.symbol} />
              <Tooltip tip='test'>
                Boosted weight
              </Tooltip>
            </Symbol>
            <Symbol>
              <TokenIcon symbol={data.metaToken?.symbol} />
              <Tooltip tip='test'>
                Rewards
              </Tooltip>
            </Symbol>
          </Container>
        }
      </FormRow>
    </>
  );
};

