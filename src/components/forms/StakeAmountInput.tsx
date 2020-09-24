import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../core/Button';
import { AmountInput } from './AmountInput';
import { Tooltip } from '../core/ReactTooltip';
import { useStakeState } from '../pages/Stake/StakeProvider';

interface Props {
  name: string;
  error?: string;
  errorLabel?: string;
  amountValue: string | null;
  amountDisabled?: boolean;
  exactDecimals?: boolean;
  onChangeAmount?(formValue: string | null): void;
  onSetMax?(): void;
}

const Error = styled.div`
  color: ${({ theme }) => theme.color.red};
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const Items = styled.div`
  > * {
    margin: 8px 0 16px 0;
  }
`;

const ItemLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s};
  text-transform: uppercase;
  font-weight: bold;
`;

const Item = styled.div<{ highlight?: boolean }>`
  ${({ highlight, theme }) =>
    highlight
      ? `
    background: #ffeed2;
    border: 2px ${theme.color.gold} dashed;
    padding: 8px;
    margin-left: -8px;
    margin-right: -8px;
  `
      : ''}
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  > * {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  > :last-child {
    margin-right: 0;
  }
`;

const InputsRow = styled.div`
  width: 100%;
`;

export const StakeAmountInput: FC = () => {
  const { data, error } = useStakeState();
  const balance = data.incentivisedVotingLockup?.userStakingBalance;
  return (
    <>
      <InputsRow>
        <InputContainer>
          <AmountInput
            value='TODO'
          />
          <Tooltip tip="Select max amount to exit the pool">
            <Button type="button" onClick={() => 'TODO'}>
              Max
            </Button>
          </Tooltip>
        </InputContainer>
      </InputsRow>
      <div>
        <Items>
          <Item key="balance">
            <ItemLabel>Balance</ItemLabel>
            <div>
              {balance
                ? balance.format(
                  18,
                  true,
                  data.incentivisedVotingLockup?.stakingToken.symbol,
                )
                : '—'}
            </div>
          </Item>
        </Items>
        <Error>
          <div>{error}</div>
        </Error>
      </div>
    </>
  );
};
