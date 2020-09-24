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

const SimulatedData = styled.p`
  color: green;
`;

export const StakeInfo: FC = () => {
  const {
    // lockupAmount: { formValue: amountFormValue, amount },
    // lockupPeriod: { formValue: lockupDays, unlockTime },
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
  // useEffect(() => {}, []);

  return (
    <>
      <FormRow>
        <H3>Totals</H3>
        <Container>
          <Row>
            <Tooltip tip="This">Total MTA staked: </Tooltip>{' '}
            {totalValue ? (
              <CountUp end={totalValue.simple} />
            ) : (
              <Skeleton width={100} />
            )}
          </Row>
          <Row>
            <Tooltip tip="This">Total weekly rewards: </Tooltip>{' '}
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
                <CountUp end={userLockup.value.simple} suffix=" MTA" /> for{' '}
                {(userLockup.length / ONE_WEEK.toNumber()).toFixed(1)} weeks on{' '}
                {userLockup.ts
                  ? format(userLockup.ts * 1000, 'dd-MM-yyyy')
                  : null}
              </Row>
              <Row>
                <Tooltip tip="This">Voting Power: </Tooltip> You have{' '}
                {vmta && s && s.simple > 0 ? (
                  <CountUp
                    end={(vmta.balance.simple / s.simple) * 100}
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                of the voting power (
                {vmta ? (
                  <CountUp end={vmta.balance.simple} suffix=" vMTA" />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                out of{' '}
                {s ? (
                  <CountUp end={s.simple} suffix=" vMTA" />
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
                <Tooltip tip="This">Earning Power: </Tooltip> You have{' '}
                {userStakingBalance.simple > 0 &&
                totalStaticWeight &&
                totalStaticWeight?.simple > 0 ? (
                  <CountUp
                    end={
                      (userStakingBalance.simple / totalStaticWeight.simple) *
                      100
                    }
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                of the earning power (
                {userStakingBalance ? (
                  <CountUp end={userStakingBalance.simple} suffix=" sMTA" />
                ) : (
                  <Skeleton width={100} />
                )}{' '}
                out of{' '}
                {totalStaticWeight ? (
                  <CountUp end={totalStaticWeight.simple} suffix=" sMTA" />
                ) : (
                  <Skeleton width={100} />
                )}
                )
              </Row>
              <Row>
                <Tooltip tip="test">Your Rewards APY</Tooltip>{' '}
                {userStakingReward && userStakingReward.currentAPY ? (
                  <CountUp end={userStakingReward.currentAPY} suffix=" %" />
                ) : (
                  <Skeleton width={100} />
                )}
              </Row>
              <Row>
                <Tooltip tip="test">Unclaimed Rewards</Tooltip>{' '}
                {rewards.rewards ? (
                  <CountUp end={rewards.rewards.simple} suffix=" MTA" />
                ) : (
                  <Skeleton width={100} />
                )}
              </Row>
            </Container>
          </FormRow>
        </>
      ) : simulatedData ? (
        <>
          <FormRow>
            <H3>Your Stake</H3>
            <Container>
              <Row>
                You will stake{' '}
                {/* <CountUp end={userLockup.value.simple} suffix=" MTA" /> for{' '}
                {(userLockup.length / ONE_WEEK.toNumber()).toFixed(1)} weeks on{' '}
                {userLockup.ts
                  ? format(userLockup.ts * 1000, 'dd-MM-yyyy')
                  : null} */}
              </Row>
              <Row>
                <Tooltip tip="This">Voting Power: </Tooltip> You <b>would</b>{' '}
                have{' '}
                {/* {vmta && s && s.simple > 0 ? (
                  <CountUp
                    end={(vmta.balance.simple / s.simple) * 100}
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '} */}
                of the voting power (
                {/* {vmta ? (
                  <CountUp end={vmta.balance.simple} suffix=" vMTA" />
                ) : (
                  <Skeleton width={100} />
                )}{' '} */}
                out of{' '}
                {/* {s ? (
                  <CountUp end={s.simple} suffix=" vMTA" />
                ) : (
                  <Skeleton width={100} />
                )} */}
                )
              </Row>
            </Container>
          </FormRow>
          <FormRow>
            <H3>Your Rewards</H3>
            <Container>
              <Row>
                <Tooltip tip="This">Earning Power: </Tooltip> You <b>would</b>{' '}
                have{' '}
                {/* {userStakingBalance.simple > 0 &&
                totalStaticWeight &&
                totalStaticWeight?.simple > 0 ? (
                  <CountUp
                    end={
                      (userStakingBalance.simple / totalStaticWeight.simple) *
                      100
                    }
                    suffix=" %"
                  />
                ) : (
                  <Skeleton width={100} />
                )}{' '} */}
                of the earning power (
                {/* {userStakingBalance ? (
                  <CountUp end={userStakingBalance.simple} suffix=" sMTA" />
                ) : (
                  <Skeleton width={100} />
                )}{' '} */}
                out of{' '}
                {/* {totalStaticWeight ? (
                  <CountUp end={totalStaticWeight.simple} suffix=" sMTA" />
                ) : (
                  <Skeleton width={100} />
                )} */}
                )
              </Row>
              <Row>
                <Tooltip tip="test">Your Rewards APY</Tooltip>{' '}
                {/* {userStakingReward && userStakingReward.currentAPY ? (
                  <CountUp end={userStakingReward.currentAPY} suffix=" %" />
                ) : (
                  <Skeleton width={100} />
                )} */}
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
