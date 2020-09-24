import React, { FC } from 'react';
import styled from 'styled-components';

import { H3 } from '../../core/Typography';
import { Tooltip } from '../../core/ReactTooltip';
import { FormRow } from '../../core/Form';
import { useStakeState } from './StakeProvider';
import { useToken } from '../../../context/DataProvider/TokensProvider';
import { useTotalSupply } from '../../../context/DataProvider/subscriptions';
import { BigDecimal } from '../../../web3/BigDecimal';

const Row = styled.div`
  /* display: flex; */
  align-items: center;
  padding-bottom: 8px;
`;

const Container = styled.div`
  padding-top: 16px;
`;

export const StakeInfo: FC = () => {
  const {
    // lockupAmount: { formValue: amountFormValue, amount },
    // lockupPeriod: { formValue: lockupDays, unlockTime },
    data: { incentivisedVotingLockup, metaToken },
  } = useStakeState();
  const vmta = useToken(incentivisedVotingLockup?.address);
  const s = useTotalSupply(incentivisedVotingLockup?.address);
  const userStatic = incentivisedVotingLockup?.userStakingBalance;
  const totalStatic = incentivisedVotingLockup?.totalStaticWeight;
  // useEffect(() => {}, []);

  return (
    <FormRow>
      <H3>Your stake</H3>
      {metaToken && (
        <Container>
          <Row>
            <Tooltip tip="test">vMTA</Tooltip>
            <p>{vmta?.balance.simple}</p>
            <p>{s.simple}</p>
          </Row>
          <Row>
            <Tooltip tip="test">Boosted weight</Tooltip>
            <p>{userStatic?.simple}</p>
            <p>{totalStatic?.simple}</p>
          </Row>
          <Row>
            <Tooltip tip="test">Rewards</Tooltip>
            <br />
          </Row>
        </Container>
      )}
    </FormRow>
  );
};
