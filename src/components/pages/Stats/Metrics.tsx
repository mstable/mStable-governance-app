import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { H3, H4, P } from '../../core/Typography';
import { Tooltip } from '../../core/ReactTooltip';
import { CountUp } from '../../core/CountUp';
import { useStatsData } from './StatsDataProvider';
import { ViewportWidth } from '../../../theme';
import { useIncentivisedVotingLockupAtBlock } from './IncentivisedVotingLockupAtBlockProvider';

const Container = styled.div`
  width: 100%;
  @media (min-width: ${ViewportWidth.l}) {
    display: flex;
    flex-direction: column;
    flex: 0;
  }
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

export const Metrics: FC = () => {
  const data = useStatsData();
  const { incentivisedVotingLockup } = useIncentivisedVotingLockupAtBlock();

  const { totalValue, totalStakingRewards, lockTimes, votingToken } =
    incentivisedVotingLockup || {};
  const totalSupply = votingToken?.totalSupply;

  return (
    <Container>
      <H3 borderTop>Metrics</H3>
      <InfoGroup>
        <InfoRow
          title="Total MTA staked"
          tip="Total units of MTA locked in staking"
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
        <InfoRow
          title="Average lockup time"
          tip="Average lockup time across all stakers"
        >
          {lockTimes && totalValue && totalSupply && totalSupply.simple > 0 ? (
            <CountUp
              end={totalSupply.simple / (totalValue.simple / lockTimes.max)}
              suffix=" Days"
            />
          ) : (
            <Skeleton width={100} />
          )}
        </InfoRow>
        <InfoRow title="Total stakers">
          {data.length > 0 ? <P>{data.length}</P> : <Skeleton width={100} />}
        </InfoRow>
      </InfoGroup>
    </Container>
  );
};
