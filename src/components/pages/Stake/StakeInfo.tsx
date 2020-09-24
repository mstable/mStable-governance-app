import React, { FC } from 'react';
import styled from 'styled-components';

import { H3 } from '../../core/Typography';
import { Tooltip } from '../../core/ReactTooltip';
import { FormRow } from '../../core/Form';
import { useStakeState, useRewardsEarned } from './StakeProvider';
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

const SimulatedData = styled.p`
  color: green;
`;

export const StakeInfo: FC = () => {
  const {
    // lockupAmount: { formValue: amountFormValue, amount },
    // lockupPeriod: { formValue: lockupDays, unlockTime },
    data: { incentivisedVotingLockup, metaToken, simulatedData },
  } = useStakeState();
  const vmta = useToken(incentivisedVotingLockup?.address);
  const s = useTotalSupply(incentivisedVotingLockup?.address);
  const userStatic =
    incentivisedVotingLockup?.userStakingBalance || new BigDecimal(0, 18);
  const totalStatic =
    incentivisedVotingLockup?.totalStaticWeight || new BigDecimal(0, 18);
  const rewards = useRewardsEarned();
  // useEffect(() => {}, []);

  return (
    <FormRow>
      <H3>Total stake</H3>
      {metaToken && (
        <Container>
          <Row>
            <Tooltip tip="test">MTA</Tooltip>
            <p>Yours: {incentivisedVotingLockup?.userLockup?.value.simple}</p>
            <SimulatedData>
              Simulated: {simulatedData?.userLockup?.value.simple}
            </SimulatedData>
            <p>Total: {incentivisedVotingLockup?.totalValue.simple}</p>
            <SimulatedData>
              Simulated Total: {simulatedData?.totalValue.simple}
            </SimulatedData>
          </Row>
        </Container>
      )}
      <H3>Your stake</H3>
      {metaToken && (
        <Container>
          <Row>
            <Tooltip tip="test">vMTA</Tooltip>
            <p>Yours: {vmta?.balance.simple}</p>
            <SimulatedData>
              Simulated: {simulatedData?.userLockup?.bias}
            </SimulatedData>
            <p>Total: {s.simple}</p>
          </Row>
          <Row>
            <Tooltip tip="test">Boosted weight</Tooltip>
            <p>Yours: {userStatic.simple}</p>
            <SimulatedData>
              Simulated: {simulatedData?.userStakingBalance?.simple}
            </SimulatedData>
            <p>Total: {totalStatic.simple}</p>
            <p>
              Share:{' '}
              {incentivisedVotingLockup?.userStakingReward?.poolShare?.simple}
            </p>
            <SimulatedData>
              Simulated Share: {simulatedData?.userStakingReward?.poolShare}
            </SimulatedData>
          </Row>
          <Row>
            <Tooltip tip="test">Rewards</Tooltip>
            <p>Yours: {rewards.rewards?.simple}</p>
            <p>
              APY: {incentivisedVotingLockup?.userStakingReward?.currentAPY} %
            </p>
            <SimulatedData>
              Simulated APY: {simulatedData?.userStakingReward?.currentAPY}
            </SimulatedData>
          </Row>
        </Container>
      )}
    </FormRow>
  );
};
