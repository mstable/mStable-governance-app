import React, { FC, useMemo } from 'react';
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { useStakeDispatch, useStakeState } from './StakeProvider';
import { RangeInput } from '../../forms/RangeInput';
import { TokenIcon } from '../../icons/TokenIcon';
import { Tooltip } from '../../core/ReactTooltip';
import { InlineTokenAmountInput } from '../../forms/InlineTokenAmountInput';

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
    amount,
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
  return (
    <>
      <FormRow>
        <H3>
          <Tooltip tip='test'>
            Deposit Amount
          </Tooltip>
        </H3>
        {/* TODO: add balances label */}
        {data.metaToken && data.incentivisedVotingLockup ?
          <InlineTokenAmountInput
            amount={{
              value: amount,
              formValue,
              handleChange: setVoteAmount
              // TODO: handleSetMax
            }
            }
            token={{
              address: data.metaToken.address,
            }}
            approval={{
              spender: data.incentivisedVotingLockup.address
            }}
            error={error}
          />
          :
          <Skeleton />
        }
      </FormRow>
      <FormRow>
        <H3>
          <Tooltip tip='test'>
            Lock up deposit
          </Tooltip>
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

