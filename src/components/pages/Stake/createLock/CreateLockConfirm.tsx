import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton/lib';

import { useTotalSupply } from '../../../../context/DataProvider/subscriptions';
import { ONE_WEEK } from '../../../../utils/constants';
import { CountUp } from '../../../core/CountUp';
import { H3, H4 } from '../../../core/Typography';
import { Tooltip } from '../../../core/ReactTooltip';
import { useStakeState } from '../StakeProvider';
import { ViewportWidth } from '../../../../theme';
import { TransactionType } from '../types';

const SimulatedCountUp = styled(CountUp)`
  color: ${({ theme }) => theme.color.green};
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
`;

const Container = styled.div<{ valid: boolean }>`
  margin-top: 16px;
  /* opacity: ${({ valid }) => (valid ? 1 : 0.5)}; */

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

export const CreateLockConfirm: FC = () => {
  const {
    data: { incentivisedVotingLockup, simulatedData },
    valid,
    transactionType,
  } = useStakeState();

  const { address } = incentivisedVotingLockup || {};

  const totalSupply = useTotalSupply(address);

  const {
    totalStaticWeight: simTotalStaticWeight,
    userLockup: simUserLockup,
    userStakingBalance: simUserStakingBalance,
    userStakingReward: simUserStakingReward,
  } = simulatedData || {};
  const txValueCheck =
    transactionType === TransactionType.IncreaseLockTime
      ? incentivisedVotingLockup?.userLockup?.value.simple
      : undefined;
  const txCalcCheck =
    transactionType === TransactionType.IncreaseLockTime
      ? (
          (incentivisedVotingLockup?.userLockup?.length as number) /
          ONE_WEEK.toNumber()
        ).toFixed(1)
      : '-';
  return (
    <Container valid={valid}>
      <div>
        <H3 borderTop>Your stake</H3>
        <InfoGroup>
          <InfoRow title="You will stake">
            <SimulatedCountUp
              end={
                simUserLockup && simUserLockup.value.simple > 0
                  ? simUserLockup.value.simple
                  : txValueCheck
              }
              suffix=" MTA"
            />{' '}
            for{' '}
            {simUserLockup
              ? (simUserLockup.length / ONE_WEEK.toNumber()).toFixed(1)
              : txCalcCheck}{' '}
            weeks
          </InfoRow>
          <InfoRow
            title="Voting Power"
            tip="Voting power (AKA vMTA balance) decays linearly over time - vMTA balance is used as your voting weight in community proposals"
          >
            You would start with{' '}
            {simUserLockup?.bias.simple &&
            simUserLockup.bias.simple > 0 &&
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
              '-'
            )}{' '}
            of the voting power (
            <SimulatedCountUp
              end={simUserLockup?.bias.simple}
              suffix=" vMTA"
              decimals={4}
            />{' '}
            out of{' '}
            {totalSupply ? (
              <SimulatedCountUp
                end={
                  simUserLockup?.bias
                    ? totalSupply.simple + simUserLockup.bias.simple
                    : undefined
                }
                suffix=" vMTA"
                decimals={4}
              />
            ) : (
              <Skeleton width={100} />
            )}
            )
          </InfoRow>
        </InfoGroup>
      </div>
      <div>
        <H3 borderTop>Your rewards</H3>
        <InfoGroup>
          <InfoRow
            title="Earning Power"
            tip="Earning power is a function of amount staked and lockup time. The longer the lockup, the higher the earning power. Specifically, power = stake * sqrt(time)."
          >
            You would start with{' '}
            {simTotalStaticWeight &&
            simUserStakingBalance &&
            simTotalStaticWeight.simple > 0 &&
            simUserStakingBalance.simple > 0 ? (
              <SimulatedCountUp
                end={
                  (simUserStakingBalance.simple / simTotalStaticWeight.simple) *
                  100
                }
                suffix=" %"
                decimals={6}
              />
            ) : (
              '-'
            )}{' '}
            of the earning power (
            <SimulatedCountUp
              end={simUserStakingBalance?.simple}
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
            title="Your rewards APY"
            tip="APY is highly volatile because it is based on your earning power with respect to the total earning power. As more MTA is staked, a users share is likely to go down."
          >
            {simUserStakingReward ? (
              <SimulatedCountUp
                end={simUserStakingReward.currentAPY || 0}
                suffix=" %"
              />
            ) : (
              '-'
            )}
          </InfoRow>
        </InfoGroup>
      </div>
    </Container>
  );
};
