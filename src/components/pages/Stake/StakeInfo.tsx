import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import format from 'date-fns/format';

import { H3 } from '../../core/Typography';
import { Tooltip } from '../../core/ReactTooltip';
import { FormRow } from '../../core/Form';
import { CountUp } from '../../core/CountUp';
import { useStakeState, useRewardsEarned } from './StakeProvider';
import { useToken } from '../../../context/DataProvider/TokensProvider';
import { useTotalSupply } from '../../../context/DataProvider/subscriptions';
import { ONE_WEEK } from '../../../web3/constants';

const Row = styled.div`
  /* display: flex; */
  align-items: center;
  padding-bottom: 8px;
`;

const Container = styled.div`
  padding-top: 16px;
`;

const ChangingCountUp = styled(CountUp)`
  color: ${({ theme }) => theme.color.blue};
`;

const SimulatedCountUp = styled(CountUp)`
  color: ${({ theme }) => theme.color.green};
`;

export const StakeInfo: FC = () => {
  const {
    data: { incentivisedVotingLockup, simulatedData },
  } = useStakeState();

  const {
    totalValue,
    userLockup,
    userStakingBalance,
    totalStaticWeight,
    totalStakingRewards,
    userStakingReward,
    address,
  } = incentivisedVotingLockup || {};
  const vmta = useToken(address);
  const s = useTotalSupply(address);
  const rewards = useRewardsEarned();

  const {
    totalStaticWeight: simTotalStaticWeight,
    userLockup: simUserLockup,
    userStakingBalance: simUserStakingBalance,
    userStakingReward: simUserStakingReward,
  } = simulatedData || {};
  // console.log(
  //   'data',
  //   simTotalStaticWeight,
  //   simulatedData,
  //   simUserLockup,
  //   simUserStakingBalance,
  // );
  return (
    <>
      <FormRow>
        <H3>Totals</H3>
        <Container>
          <Row>
            <Tooltip tip="Total units of MTA locked in Staking">
              Total MTA staked:{' '}
            </Tooltip>{' '}
            {totalValue ? (
              <CountUp end={totalValue.simple} />
            ) : (
              <Skeleton width={100} />
            )}
          </Row>
          <Row>
            <Tooltip tip="Units of MTA being emitted to stakers this week">
              Total weekly rewards:{' '}
            </Tooltip>{' '}
            {totalStakingRewards ? (
              <CountUp end={totalStakingRewards.simple} suffix=" MTA" />
            ) : (
              <Skeleton width={100} />
            )}
          </Row>
        </Container>
      </FormRow>
      {userStakingBalance && userLockup && userStakingBalance.simple > 0 ? (
        <>
          <FormRow>
            <H3>Your Stake</H3>
            <Container>
              <Row>
                You staked{' '}
                <ChangingCountUp end={userLockup.value.simple} suffix=" MTA" />{' '}
                for {(userLockup.length / ONE_WEEK.toNumber()).toFixed(1)} weeks
                on{' '}
                {userLockup.ts
                  ? format(userLockup.ts * 1000, 'dd-MM-yyyy')
                  : null}
              </Row>
              <Row>
                <Tooltip tip="Voting power (a.k.a vMTA balance) decays linearly over time - vMTA balance is used as your voting weight in community proposals">
                  Voting Power:{' '}
                </Tooltip>{' '}
                You have{' '}
                {vmta && s && s.simple > 0 ? (
                  <ChangingCountUp
                    end={(vmta.balance.simple / s.simple) * 100}
                    suffix=" %"
                    decimals={6}
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                of the voting power (
                {vmta ? (
                  <ChangingCountUp
                    end={vmta.balance.simple}
                    decimals={4}
                    suffix=" vMTA"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                out of{' '}
                {s ? (
                  <ChangingCountUp end={s.simple} decimals={4} suffix=" vMTA" />
                ) : (
                  <Skeleton width={100} />
                )}
                )
              </Row>
            </Container>
          </FormRow>
          <FormRow>
            <H3>Your Rewards</H3>
            <Container>
              <Row>
                <Tooltip tip="Earning power is a function of amount staked and lockup time. The longer the lockup, the higher the earning power. Specifically, power = stake * sqrt(time).">
                  Earning Power:{' '}
                </Tooltip>{' '}
                You have{' '}
                {userStakingBalance.simple > 0 &&
                totalStaticWeight &&
                totalStaticWeight?.simple > 0 ? (
                  <ChangingCountUp
                    end={
                      (userStakingBalance.simple / totalStaticWeight.simple) *
                      100
                    }
                    decimals={6}
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                of the earning power (
                {userStakingBalance ? (
                  <ChangingCountUp
                    end={userStakingBalance.simple}
                    decimals={4}
                    suffix=" pMTA"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                out of{' '}
                {totalStaticWeight ? (
                  <ChangingCountUp
                    end={totalStaticWeight.simple}
                    decimals={4}
                    suffix=" pMTA"
                  />
                ) : (
                  <Skeleton width={100} />
                )}
                )
              </Row>
              <Row>
                <Tooltip tip="APY is highly volatile because it is based on your earning power with respect to the total earning power. As more MTA is Staked, a users share is likely to go down.">
                  Your Rewards APY
                </Tooltip>{' '}
                {userStakingReward && userStakingReward.currentAPY ? (
                  <ChangingCountUp
                    end={userStakingReward.currentAPY}
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}
              </Row>
              <Row>
                <Tooltip tip="Your unclaimed MTA reward units">
                  Unclaimed Rewards
                </Tooltip>{' '}
                {rewards.rewards ? (
                  <ChangingCountUp
                    end={rewards.rewards.simple}
                    decimals={8}
                    suffix=" MTA"
                  />
                ) : (
                  <Skeleton width={100} />
                )}
              </Row>
            </Container>
          </FormRow>
        </>
      ) : simulatedData && simUserLockup && simUserStakingBalance ? (
        <>
          <FormRow>
            <H3>Your Stake</H3>
            <Container>
              <Row>
                You will stake{' '}
                <SimulatedCountUp
                  end={simUserLockup.value.simple}
                  suffix=" MTA"
                />{' '}
                for {(simUserLockup.length / ONE_WEEK.toNumber()).toFixed(1)}{' '}
                weeks
              </Row>
              <Row>
                <Tooltip tip="Voting power (a.k.a vMTA balance) decays linearly over time - vMTA balance is used as your voting weight in community proposals">
                  Voting Power:{' '}
                </Tooltip>{' '}
                You <b>would</b> start with{' '}
                {s && s.simple > 0 ? (
                  <SimulatedCountUp
                    end={
                      (simUserLockup.bias.simple /
                        (s.simple + simUserLockup.bias.simple)) *
                      100
                    }
                    decimals={6}
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                of the voting power (
                <SimulatedCountUp
                  end={simUserLockup.bias.simple}
                  suffix=" vMTA"
                  decimals={4}
                />{' '}
                out of{' '}
                {s ? (
                  <SimulatedCountUp
                    end={s.simple + simUserLockup.bias.simple}
                    suffix=" vMTA"
                    decimals={4}
                  />
                ) : (
                  <Skeleton width={100} />
                )}
                )
              </Row>
            </Container>
          </FormRow>
          <FormRow>
            <H3>Your Rewards</H3>
            <Container>
              <Row>
                <Tooltip tip="Earning power is a function of amount staked and lockup time. The longer the lockup, the higher the earning power. Specifically, power = stake * sqrt(time).">
                  Earning Power:{' '}
                </Tooltip>{' '}
                You <b>would</b> start with{' '}
                {simTotalStaticWeight && simTotalStaticWeight.simple > 0 ? (
                  <SimulatedCountUp
                    end={
                      (simUserStakingBalance.simple /
                        simTotalStaticWeight.simple) *
                      100
                    }
                    suffix=" %"
                    decimals={6}
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                of the earning power (
                <SimulatedCountUp
                  end={simUserStakingBalance.simple}
                  suffix=" pMTA"
                  decimals={4}
                />{' '}
                out of{' '}
                {simTotalStaticWeight ? (
                  <SimulatedCountUp
                    end={simTotalStaticWeight.simple}
                    suffix=" pMTA"
                    decimals={4}
                  />
                ) : (
                  <Skeleton width={100} />
                )}
                )
              </Row>
              <Row>
                <Tooltip tip="APY is highly volatile because it is based on your earning power with respect to the total earning power. As more MTA is Staked, a users share is likely to go down.">
                  Your Rewards APY
                </Tooltip>{' '}
                {simUserStakingReward ? (
                  <SimulatedCountUp
                    end={simUserStakingReward.currentAPY || 0}
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}
              </Row>
            </Container>
          </FormRow>
        </>
      ) : (
        <Skeleton height={300} />
      )}
    </>
  );
};
