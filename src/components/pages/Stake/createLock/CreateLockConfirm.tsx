import React, { ComponentProps, FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton/lib';

import { useTotalSupply } from '../../../../context/DataProvider/subscriptions';
import { useToken } from '../../../../context/DataProvider/TokensProvider';
import { ONE_WEEK } from '../../../../utils/constants';
import { CountUp } from '../../../core/CountUp';
import { H3, H4 } from '../../../core/Typography';
import { Tooltip } from '../../../core/ReactTooltip';
import { useStakeState } from '../StakeProvider';
import { Color, ViewportWidth } from '../../../../theme';
import { TransactionType } from '../types';
import { formatUnix } from '../../../../utils/time';

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

const DifferentialCountup: FC<ComponentProps<typeof CountUp> & {
  prevValue?: number;
  currentValue?: number;
}> = ({ prevValue, currentValue, ...props }) => {
  return (
    <CountUp
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      highlight
      highlightColor={
        typeof prevValue !== 'number' ||
        typeof currentValue !== 'number' ||
        prevValue === currentValue
          ? Color.blue
          : currentValue > prevValue
          ? Color.green
          : Color.red
      }
    />
  );
};

export const CreateLockConfirm: FC = () => {
  const {
    data: { incentivisedVotingLockup, simulatedData },
    valid,
    transactionType,
  } = useStakeState();

  const {
    address,
    lockTimes,
    userLockup,
    userStakingBalance,
    userStakingReward,
  } = incentivisedVotingLockup || {};

  const totalSupply = useTotalSupply(address);
  const { balance: vMTABalance } = useToken(address) || {};

  const {
    totalStaticWeight: simTotalStaticWeight,
    userLockup: simUserLockup,
    userStakingBalance: simUserStakingBalance,
    userStakingReward: simUserStakingReward,
  } = simulatedData || {};

  // Add any additional staking balance to simulate the total supply
  const simTotalSupply =
    totalSupply.simple +
    (simUserLockup?.bias.simple || 0) -
    (userLockup?.bias.simple || 0);

  const cannotIncreaseTime =
    userLockup && lockTimes && lockTimes.max <= userLockup.lockDays;

  const existingLockupValue =
    transactionType === TransactionType.IncreaseLockTime
      ? userLockup?.value.simple
      : undefined;

  const simulatedOrExistingUserLockup =
    transactionType === TransactionType.IncreaseLockAmount || cannotIncreaseTime
      ? userLockup
      : simUserLockup;

  return (
    <Container valid={valid}>
      <div>
        <H3 borderTop>Your stake</H3>
        <InfoGroup>
          <InfoRow title="You will stake">
            <CountUp
              end={
                simUserLockup && simUserLockup.value.simple > 0
                  ? simUserLockup.value.simple
                  : existingLockupValue
              }
              suffix=" MTA"
            />{' '}
            {simulatedOrExistingUserLockup
              ? `from ${formatUnix(
                  simulatedOrExistingUserLockup.ts,
                )} until ${formatUnix(
                  simulatedOrExistingUserLockup.lockTime,
                )} (${(
                  simulatedOrExistingUserLockup.length / ONE_WEEK.toNumber()
                ).toFixed(1)} weeks)`
              : '-'}
          </InfoRow>
          <InfoRow
            title="Voting Power"
            tip="Voting power (AKA vMTA balance) decays linearly over time - vMTA balance is used as your voting weight in community proposals"
          >
            You would start with{' '}
            {simUserLockup?.bias.simple &&
            simUserLockup.bias.simple > 0 &&
            simTotalSupply > 0 ? (
              <DifferentialCountup
                end={(simUserLockup.bias.simple / simTotalSupply) * 100}
                prevValue={vMTABalance?.simple}
                currentValue={simUserLockup?.bias.simple}
                decimals={6}
                suffix=" %"
              />
            ) : (
              '-'
            )}{' '}
            of the voting power (
            <DifferentialCountup
              end={simUserLockup?.bias.simple}
              prevValue={vMTABalance?.simple}
              currentValue={simUserLockup?.bias.simple}
              suffix=" vMTA"
              decimals={4}
            />{' '}
            out of{' '}
            {simTotalSupply ? (
              <CountUp
                end={simUserLockup?.bias ? simTotalSupply : undefined}
                suffix=" vMTA"
                decimals={4}
                highlightColor={Color.green}
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
              <DifferentialCountup
                end={
                  (simUserStakingBalance.simple / simTotalStaticWeight.simple) *
                  100
                }
                prevValue={userStakingBalance?.simple}
                currentValue={simUserStakingBalance?.simple}
                suffix=" %"
                decimals={6}
              />
            ) : (
              '-'
            )}{' '}
            of the earning power (
            <CountUp
              end={simUserStakingBalance?.simple}
              suffix=" pMTA"
              decimals={4}
            />{' '}
            out of{' '}
            {simTotalStaticWeight ? (
              <DifferentialCountup
                end={simTotalStaticWeight.simple}
                prevValue={userStakingBalance?.simple}
                currentValue={simUserStakingBalance?.simple}
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
              <DifferentialCountup
                end={simUserStakingReward.currentAPY || 0}
                prevValue={userStakingReward?.currentAPY}
                currentValue={simUserStakingReward?.currentAPY}
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
