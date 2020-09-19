import React, { FC } from 'react';
import styled from 'styled-components';

import { H3 } from '../../core/Typography';
import { Tooltip } from '../../core/ReactTooltip';
import { FormRow } from '../../core/Form';
import { useStakeState } from './StakeProvider';

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
`;

const Container = styled.div`
  padding-top: 16px;
`;

export const StakeInfo: FC = () => {
  const { data } = useStakeState();
  return (
    <FormRow>
      <H3>Your stake</H3>
      {data.metaToken && (
        <Container>
          <Row>
            <Tooltip tip="test">vMTA</Tooltip>
          </Row>
          <Row>
            <Tooltip tip="test">Boosted weight</Tooltip>
          </Row>
          <Row>
            <Tooltip tip="test">Rewards</Tooltip>
          </Row>
        </Container>
      )}
    </FormRow>
  );
};
