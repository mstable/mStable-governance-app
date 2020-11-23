import React, { FC, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useMetaToken } from '../../../context/DataProvider/TokensProvider';
import { ViewportWidth } from '../../../theme';
import { CountUp } from '../../core/CountUp';
import { useStakeDispatch, useStakeState } from '../Stake/StakeProvider';
import { useIncentivisedVotingLockupAtBlock } from '../Stats/IncentivisedVotingLockupAtBlockProvider';
import { useStatsData } from '../Stats/StatsDataProvider';

const Container = styled.div`
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 1.5rem;
  border-radius: 1rem;

  @media (min-width: ${ViewportWidth.xl}) {
    flex-basis: calc(60% - 0.5rem);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.5rem;
    line-height: 1em;
    font-weight: 600;
    margin-right: 1rem;
  }

  a:hover {
    > span {
      background: #f0f0f0;
      border-radius: 0.5rem;
      border-bottom: 0;
    }
  }

  a {
    font-size: 0.875rem;
    border-bottom: 0;
    color: ${({ theme }) => theme.color.blue};
    font-weight: 600;

    > span {
      border-bottom: 1px solid ${({ theme }) => theme.color.blue};
      color: #676767;
      font-weight: normal;
      padding: 0 4px;
      display: none;
    }

    > span > span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    a > span {
      display: inline;
    }
  }
`;

const Items = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  > div {
    margin: 0.5rem 0;
    flex-basis: 100%;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div {
      flex-basis: calc(50% - 0.5rem);
    }
  }
`;

const StyledRow = styled.div`
  display: flex;
  font-size: 0.875rem;

  b {
    font-weight: 600;
  }

  span {
    text-align: right;
  }

  p {
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.xs}) {
    font-size: 1rem;
  }
`;

const Row: FC<{ title: string; value?: number; suffix?: string }> = props => {
  const { title, value, suffix } = props;
  const valueRounded = value ? Math.floor(value) : undefined;
  const formattedSuffix = suffix ? ` ${suffix}` : undefined;
  return (
    <StyledRow>
      <p>
        <b>{title}:</b>
      </p>
      {value ? (
        <CountUp end={valueRounded} suffix={formattedSuffix} decimals={0} />
      ) : (
        <Skeleton width={100} />
      )}
    </StyledRow>
  );
};

export const ProtocolOverview: FC = () => {
  const { incentivisedVotingLockup } = useIncentivisedVotingLockupAtBlock();
  const { setLockupAmount, setLockupDays } = useStakeDispatch();
  const { data: stakeData } = useStakeState();
  const metaToken = useMetaToken();
  const statsData = useStatsData();

  useEffect((): undefined => {
    if (!metaToken) return;
    setLockupAmount(`${metaToken?.balance.simple}`);
    setLockupDays(180);
  }, [metaToken, setLockupAmount, setLockupDays]);

  const { userStakingReward: simUserStakingReward } =
    stakeData?.simulatedData || {};
  const { totalValue, totalStakingRewards, lockTimes, votingToken } =
    incentivisedVotingLockup || {};

  const userHasBalance = (metaToken?.balance.simple ?? 0) > 0.1;
  const totalSupply = votingToken?.totalSupply;
  const formattedBalance = metaToken?.balance.simple.toFixed(2);
  const formattedAPY = simUserStakingReward?.currentAPY?.toFixed(0);

  const lockPeriod = ((): number | undefined => {
    if (!totalValue || !totalSupply || !lockTimes) return undefined;
    return totalSupply.simple / (totalValue.simple / lockTimes.max);
  })();

  return (
    <Container>
      <Header>
        <h3>Metrics</h3>
        <Link to="/stake">
          Stake{' '}
          {userHasBalance && (
            <span>
              <span>{formattedBalance}</span> MTA at
              <span>{` ~${formattedAPY ?? `0`}%`}</span> APY
            </span>
          )}
        </Link>
      </Header>
      <Items>
        <Row title="Staked" value={totalValue?.simple} suffix="MTA" />
        <Row title="Average lockup" value={lockPeriod} suffix="Days" />
        <Row
          title="Weekly rewards"
          value={totalStakingRewards?.simple}
          suffix="MTA"
        />
        <Row title="Total stakers" value={statsData?.length} />
      </Items>
    </Container>
  );
};
