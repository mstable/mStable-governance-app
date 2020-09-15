import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { FormRow } from '../../core/Form';
import { H3, P } from '../../core/Typography';
import { TokenAmountInput } from '../../forms/TokenAmountInput';
import { useTokenCtx, useGovernanceDispatch, useGovernanceState } from './GovernanceProvider';


const MIN = 0
const MAX = 365

const now = new Date()

const StyledInput = styled.input`
	-webkit-appearance: none;
	margin: 20px 0;
	width: 100%;
  &:focus {
	  outline: none;
  }
  &::-webkit-slider-runnable-track {
	  width: 100%;
	  height: 4px;
	  cursor: pointer;
	  animate: 0.2s;
	  background: #FFFFFF;
	  border-radius: 25px;
  }
  &::-webkit-slider-thumb {
	  height: 20px;
	  width: 20px;
	  border-radius: 50%;
	  background: black;
	  box-shadow: 0 0 4px 0 rgba(0,0,0, 1);
	  cursor: pointer;
	  -webkit-appearance: none;
	  margin-top: -8px;
  }`;

const RangeValue = styled.div<{ value: number }>`
  position: relative;
  left: ${({ value }) => (100 / MAX) * value}%;
  width: 120px;
  margin-left: -60px;
  text-align: center;`;

const SliderParent = styled.div`
  position: relative;
  margin: 0.5rem auto 0.5rem;`;

const LabelWrapper = styled.div`
display: flex;
justify-content: space-between;`;

export const GovernanceInput: FC<{}> = () => {
  const {
    formValue,
    lockUpPeriod,
    error
  } = useGovernanceState();
  const token = useTokenCtx();
  const {
    setVoteAmount,
    setLockUpPeriod
  } = useGovernanceDispatch();
  const tokenAddresses = useMemo<string[]>(
    () => (token?.address ? [token?.address] : []),
    [token],
  );

  const formattedDate = useMemo(() => {
    return format(addDays(now, lockUpPeriod), "dd-MM-yyyy")
  }, [lockUpPeriod]);
  // eslint-disable-next-line no-console
  console.log('LOCK UP PERIOD LADS', lockUpPeriod);
  return (
    <>
      <FormRow>
        <H3>
          Deposit Amount
        </H3>
        <TokenAmountInput
          tokenValue={token?.address || null}
          tokenAddresses={tokenAddresses}
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
        <SliderParent>
          <RangeValue value={lockUpPeriod}>
            <div>
              {lockUpPeriod} Days
            </div>
            <div>
              ({formattedDate})
            </div>
          </RangeValue>
          <StyledInput type="range" min={MIN} max={MAX} value={lockUpPeriod}
            onChange={({ target: { value: radius } }) => {
              setLockUpPeriod(parseFloat(radius));
            }}
          />
        </SliderParent>
        <LabelWrapper>
          <P>
            Today
  				</P>
          <P>
            1 Year
  				</P>
        </LabelWrapper>
      </FormRow >
    </>
  );
};

