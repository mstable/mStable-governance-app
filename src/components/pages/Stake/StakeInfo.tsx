import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import format from 'date-fns/format';

import { H3, H4 } from '../../core/Typography';
import { Tooltip } from '../../core/ReactTooltip';
import { CountUp } from '../../core/CountUp';
import { useRewardsEarned, useStakeData } from './StakeProvider';
import { useToken } from '../../../context/DataProvider/TokensProvider';
import { useTotalSupply } from '../../../context/DataProvider/subscriptions';
import { ONE_WEEK } from '../../../utils/constants';
import { Protip } from '../../core/Protip';
import { ExternalLink } from '../../core/ExternalLink';

const ChangingCountUp = styled(CountUp)`
  color: ${({ theme }) => theme.color.blue};
`;

const SimulatedCountUp = styled(CountUp)`
  color: ${({ theme }) => theme.color.green};
`;

const Row = styled.div`
  align-items: center;
  padding-bottom: 8px;
`;

const EarningPowerProtip: FC = () => (
  <Row>
    <Protip emoji="💪" title="Earning power calculation">
      Wondering how your earning power is calculated?{' '}
      <ExternalLink href="https://medium.com/mstable/mta-staking-v1-voting-weights-and-rewards-3a25d1d42124">
        Read more here
      </ExternalLink>
    </Protip>
  </Row>
);

const InfoRow: FC<{ tip?: string; title: string }> = ({
  children,
  title,
  tip,
}) => {
  return (
    <Row>
      {tip ? (
        <Tooltip tip={tip}>
          <H4>{title}</H4>
        </Tooltip>
      ) : (
        <H4>{title}</H4>
      )}
      <div>{children}</div>
    </Row>
  );
};

const InfoGroup = styled.div`
  padding-bottom: 16px;
`;

export const StakeInfo: FC = () => {
  const { incentivisedVotingLockup, simulatedData } = useStakeData();

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
  const totalSupply = useTotalSupply(address);
  const rewards = useRewardsEarned();

  const {
    totalStaticWeight: simTotalStaticWeight,
    userLockup: simUserLockup,
    userStakingBalance: simUserStakingBalance,
    userStakingReward: simUserStakingReward,
  } = simulatedData || {};

  return (
    <>
      <H3 borderTop>Totals</H3>
      <InfoGroup>
        <InfoRow
          title="Total MTA staked"
          tip="Total units of MTA locked in Staking"
        >
          {totalValue ? (
            <CountUp end={totalValue.simple} />
          ) : (
            <Skeleton width={100} />
          )}
        </InfoRow>
        <InfoRow
          title="Total weekly rewards"
          tip="Units of MTA being emitted to stakers this week"
        >
          {totalStakingRewards ? (
            <CountUp end={totalStakingRewards.simple} suffix=" MTA" />
          ) : (
            <Skeleton width={100} />
          )}
        </InfoRow>
      </InfoGroup>
      {userStakingBalance && userLockup && userStakingBalance.simple > 0 ? (
        <>
          <H3 borderTop>Your Stake</H3>
          <InfoGroup>
            <InfoRow title="You staked">
              <ChangingCountUp end={userLockup.value.simple} suffix=" MTA" />{' '}
              for {(userLockup.length / ONE_WEEK.toNumber()).toFixed(1)} weeks
              on{' '}
              {userLockup.ts
                ? format(userLockup.ts * 1000, 'dd-MM-yyyy')
                : null}
            </InfoRow>
            <InfoRow
              title="Voting Power"
              tip="Voting power (AKA vMTA balance) decays linearly over time - vMTA balance is used as your voting weight in community proposals"
            >
              You have{' '}
              {vmta && totalSupply && totalSupply.simple > 0 ? (
                <ChangingCountUp
                  end={(vmta.balance.simple / totalSupply.simple) * 100}
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
              {totalSupply ? (
                <ChangingCountUp
                  end={totalSupply.simple}
                  decimals={4}
                  suffix=" vMTA"
                />
              ) : (
                <Skeleton width={100} />
              )}
              )
            </InfoRow>
          </InfoGroup>
          <H3 borderTop>Your Rewards</H3>
          <InfoGroup>
            <EarningPowerProtip />
            <InfoRow
              title="Earning Power"
              tip="Earning power is a function of amount staked and lockup time. The longer the lockup, the higher the earning power. Specifically, power = stake * sqrt(time)."
            >
              <>
                <div>
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
                </div>
              </>
            </InfoRow>
            <InfoRow
              title="Your Rewards APY"
              tip="APY is highly volatile because it is based on your earning power with respect to the total earning power. As more MTA is staked, a users share is likely to go down."
            >
              {userStakingReward && userStakingReward.currentAPY ? (
                <ChangingCountUp
                  end={userStakingReward.currentAPY}
                  suffix=" %"
                />
              ) : (
                <Skeleton width={100} />
              )}
            </InfoRow>
            <InfoRow
              title="Unclaimed Rewards"
              tip="Your unclaimed MTA reward units"
            >
              {rewards.rewards ? (
                <ChangingCountUp
                  end={rewards.rewards.simple}
                  decimals={8}
                  suffix=" MTA"
                />
              ) : (
                <Skeleton width={100} />
              )}
            </InfoRow>
          </InfoGroup>
        </>
      ) : simulatedData && simUserLockup && simUserStakingBalance ? (
        <>
          <H3 borderTop>Your Stake</H3>
          <InfoGroup>
            <InfoRow title="You will stake">
              <SimulatedCountUp
                end={simUserLockup.value.simple}
                suffix=" MTA"
              />{' '}
              for {(simUserLockup.length / ONE_WEEK.toNumber()).toFixed(1)}{' '}
              weeks
            </InfoRow>
            <InfoRow
              title="Voting Power"
              tip="Voting power (AKA vMTA balance) decays linearly over time - vMTA balance is used as your voting weight in community proposals"
            >
              You <b>would</b> start with{' '}
              {simUserLockup.bias.simple &&
              totalSupply &&
              totalSupply.simple > 0 ? (
                <SimulatedCountUp
                  end={
                    (simUserLockup.bias.simple /
                      (totalSupply.simple + simUserLockup.bias.simple)) *
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
              {totalSupply ? (
                <SimulatedCountUp
                  end={totalSupply.simple + simUserLockup.bias.simple}
                  suffix=" vMTA"
                  decimals={4}
                />
              ) : (
                <Skeleton width={100} />
              )}
              )
            </InfoRow>
          </InfoGroup>
          <H3 borderTop>Your Rewards</H3>
          <InfoGroup>
            <EarningPowerProtip />
            <InfoRow
              title="Earning Power"
              tip="Earning power is a function of amount staked and lockup time. The longer the lockup, the higher the earning power. Specifically, power = stake * sqrt(time)."
            >
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
            </InfoRow>
            <InfoRow
              title="Your Rewards APY"
              tip="APY is highly volatile because it is based on your earning power with respect to the total earning power. As more MTA is staked, a users share is likely to go down."
            >
              {simUserStakingReward ? (
                <SimulatedCountUp
                  end={simUserStakingReward.currentAPY || 0}
                  suffix=" %"
                />
              ) : (
                <Skeleton width={100} />
              )}
            </InfoRow>
          </InfoGroup>
        </>
      ) : (
        <Skeleton height={300} />
      )}
    </>
  );
};
