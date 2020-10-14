import React, { FC, useState } from 'react';
import styled from 'styled-components';
import useDebounce from 'react-use/lib/useDebounce';

import { useBlockNumber } from '../../../context/DataProvider/BlockProvider';
import { useIncentivisedVotingLockupAtBlock } from './IncentivisedVotingLockupAtBlockProvider';
import { StyledInput } from '../../forms/StyledInput';
import { H3 } from '../../core/Typography';
import { CHAIN_ID } from '../../../utils/constants';

const CONTRACT_DEPLOY_BLOCK = CHAIN_ID === 1 ? 10932900 : 1;

const Container = styled.div`
  margin-bottom: 16px;

  input {
    max-width: 320px;
  }
`;

const BlockTip = styled.div`
  font-size: 12px;
  text-transform: uppercase;

  span {
    font-weight: bold;
  }
`;

export const BlockFilter: FC = () => {
  const blockNumber = useBlockNumber();
  const [blockVal, setBlockVal] = useState<number | undefined>();
  const { setBlock } = useIncentivisedVotingLockupAtBlock();

  const error = !blockVal
    ? undefined
    : blockVal < CONTRACT_DEPLOY_BLOCK ||
      (blockNumber && blockVal > blockNumber)
    ? 'Invalid block'
    : undefined;

  useDebounce(
    () => {
      if (!error) {
        setBlock(blockVal as number);
      }
    },
    1000,
    [blockVal, error],
  );

  return (
    <Container>
      <H3 borderTop>View stats at block</H3>
      <StyledInput
        error={error}
        placeholder="Block number"
        type="number"
        min={CONTRACT_DEPLOY_BLOCK}
        max={blockNumber}
        onChange={({ currentTarget }) => {
          const value = parseInt(currentTarget.value, 10) ?? undefined;
          setBlockVal(value);
        }}
      />
      <BlockTip>
        Start <span>{CONTRACT_DEPLOY_BLOCK}</span>
      </BlockTip>
      {blockNumber && (
        <BlockTip>
          Current <span>{blockNumber}</span>
        </BlockTip>
      )}
    </Container>
  );
};
