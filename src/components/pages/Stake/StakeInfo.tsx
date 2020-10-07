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
import { ViewportWidth } from '../../../theme';
import { EtherscanLink } from '../../core/EtherscanLink';
import { Protip } from '../../core/Protip';

const ChangingCountUp = styled(CountUp)`
  color: ${({ theme }) => theme.color.blue};
`;

const Row = styled.div`
  align-items: center;
  padding-bottom: 8px;
`;

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
  min-height: 65px;
  @media (min-width: ${ViewportWidth.s}) {
    min-height: 155px;
  }
`;

const UserStake: FC = () => {
  const { incentivisedVotingLockup } = useStakeData();

  const {
    userLockup,
    userStakingBalance,
    totalStaticWeight,
    userStakingReward,
    address,
  } = incentivisedVotingLockup || {};

  const vmta = useToken(address);
  const totalSupply = useTotalSupply(address);
  const rewards = useRewardsEarned();

  return (
    <div>
      <H3 borderTop>Your stake</H3>
      {userStakingBalance && userLockup && userStakingBalance.simple > 0 ? (
        <>
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
          <H3 borderTop>Your rewards</H3>
          <InfoGroup>
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
              title="Your rewards APY"
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
      ) : (
        <InfoGroup>
          <InfoRow title="No stake">
            <p>
              You have not yet staked; you can stake MTA with the stake form
              below.
            </p>
          </InfoRow>
          {userLockup &&
            userLockup.ejected &&
            userLockup.ejectedHash &&
            rewards.rewards &&
            rewards.rewards.simple > 0 && (
              <>
                <br />
                <Protip emoji="⌛" title="Your previous stake has finished">
                  Your previous stake completed - you were ejected from the pool
                  and your stake has been returned (see
                  <EtherscanLink data={userLockup.ejectedHash} />)
                  <br />
                  You still have {rewards.rewards.simple} MTA to claim!
                </Protip>
              </>
            )}
        </InfoGroup>
      )}
    </div>
  );
};

const TotalsAndAverages: FC = () => {
  const { incentivisedVotingLockup } = useStakeData();
  const { totalValue, totalStakingRewards, lockTimes } =
    incentivisedVotingLockup || {};
  const { address } = incentivisedVotingLockup || {};
  const totalSupply = useTotalSupply(address);
  return (
    <div>
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
      <H3 borderTop>Averages</H3>
      <InfoGroup>
        <InfoRow
          title="Average Lockup Time"
          tip="Average lockup time of all lockups"
        >
          {lockTimes && totalValue && totalSupply && totalSupply.simple > 0 ? (
            <ChangingCountUp
              end={totalSupply.simple / (totalValue.simple / lockTimes.max)}
              suffix=" Days"
            />
          ) : (
            <Skeleton width={100} />
          )}
        </InfoRow>
      </InfoGroup>
    </div>
  );
};

const Container = styled.div`
  > * {
    width: 100%;
    margin-bottom: 16px;
  }

  @media (min-width: ${ViewportWidth.s}) {
    display: flex;
    justify-content: space-between;

    > :first-child {
      margin-right: 8px;
    }

    > :last-child {
      margin-left: 8px;
    }
  }
`;

export const StakeInfo: FC = () => {
  return (
    <Container>
      <UserStake />
      <TotalsAndAverages />
    </Container>
  );
};
