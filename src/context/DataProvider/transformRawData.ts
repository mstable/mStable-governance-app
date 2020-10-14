import { BigNumber } from 'ethers/utils';

import { BigDecimal } from '../../utils/BigDecimal';
import { ONE_DAY, ONE_WEEK } from '../../utils/constants';
import { durationInDaysUnix, nowUnix } from '../../utils/time';
import {
  IncentivisedVotingLockup,
  UserStakingReward,
  UserLockup,
} from './types';
import { IncentivisedVotingLockupsQueryResult } from '../../graphql/mstable';

type HistoricIncentivisedVotingLockup = NonNullable<
  IncentivisedVotingLockupsQueryResult['data']
>['historic'][0];

type CurrentIncentivisedVotingLockup = NonNullable<
  IncentivisedVotingLockupsQueryResult['data']
>['current'][0];

const transformUserLockup = (
  data: CurrentIncentivisedVotingLockup['userLockups'][0] | undefined,
): UserLockup | undefined => {
  if (data) {
    const ts = parseInt(data.ts, 10);
    const lockTime = parseInt(data.lockTime, 10);
    const lockDays = durationInDaysUnix(lockTime, ts);
    return {
      ejected: data.ejected,
      ejectedHash: data.ejectedHash,
      lockTime,
      lockDays,
      ts,
      length: lockTime - ts,
      value: new BigDecimal(data.value),
      bias: new BigDecimal(data.bias),
      slope: new BigNumber(data.slope),
    };
  }
  return undefined;
};

const transformUserStakingReward = (
  data?: CurrentIncentivisedVotingLockup['stakingRewards'][0],
): UserStakingReward | undefined => {
  if (data) {
    const { amount, amountPerTokenPaid, rewardsPaid } = data;
    return {
      amount: new BigDecimal(amount),
      amountPerTokenPaid: new BigDecimal(amountPerTokenPaid),
      rewardsPaid: new BigDecimal(rewardsPaid),
    };
  }
  return undefined;
};

const transformUserStakingBalance = (
  data?: CurrentIncentivisedVotingLockup['stakingBalances'][0],
): BigDecimal | undefined => {
  if (data) {
    return new BigDecimal(data.amount);
  }
  return undefined;
};

export const transformRawTokenData = ({
  decimals,
  totalSupply,
  symbol,
  address,
}: CurrentIncentivisedVotingLockup['stakingToken']): IncentivisedVotingLockup['stakingToken'] => ({
  address,
  totalSupply: new BigDecimal(totalSupply, decimals),
  decimals,
  symbol,
});

export const transformRawIncentivisedVotingLockups = (
  data: IncentivisedVotingLockupsQueryResult['data'],
): IncentivisedVotingLockup | undefined => {
  const current = data?.current?.[0];
  const historic = data?.historic?.[0];

  if (!(current || historic)) {
    return undefined;
  }

  const {
    address,
    end,
    duration,
    expired,
    globalEpoch,
    lastUpdateTime,
    maxTime,
    periodFinish,
    rewardPerTokenStored,
    rewardRate,
    rewardsToken,
    stakingToken,
    votingToken,
    totalStakingRewards,
    totalStaticWeight,
    totalValue,
  } = (current ?? historic) as HistoricIncentivisedVotingLockup;

  // Get current unix
  const now = nowUnix();
  const unixWeekCount = Math.floor(now / ONE_WEEK.toNumber());
  const nextUnixWeek = (unixWeekCount + 1) * ONE_WEEK.toNumber();

  // Min days = nextUnixWeekStart - now
  const minDays = Math.ceil((nextUnixWeek - now) / ONE_DAY.toNumber());

  const endBN = new BigNumber(end);
  const startBN = endBN.sub(maxTime);

  // Max days = (end - nextUnixWeek) + min days
  const maxDays = Math.floor(
    (endBN.toNumber() - nextUnixWeek) / ONE_DAY.toNumber() + minDays,
  );

  const incentivisedVotingLockup: IncentivisedVotingLockup = {
    address,
    periodFinish,
    lastUpdateTime,
    stakingToken: transformRawTokenData(stakingToken),
    rewardPerTokenStored: new BigDecimal(rewardPerTokenStored),
    duration: new BigNumber(duration),
    start: startBN,
    end: endBN,
    lockTimes: {
      min: minDays,
      max: maxDays,
    },
    rewardRate: new BigDecimal(rewardRate),
    rewardsToken: transformRawTokenData(rewardsToken),
    votingToken: transformRawTokenData(votingToken),
    globalEpoch: new BigNumber(globalEpoch),
    expired,
    maxTime: new BigNumber(maxTime),
    totalStaticWeight: new BigDecimal(totalStaticWeight),
    totalStakingRewards: new BigDecimal(totalStakingRewards),
    totalValue: new BigDecimal(totalValue),
  };

  // Specific to data from queries with an account provided
  if (current) {
    const [rawUserStakingBalance] = current.stakingBalances ?? [];
    const [rawUserStakingReward] = current.stakingRewards ?? [];
    const [rawUserLockup] = current.userLockups ?? [];
    incentivisedVotingLockup.userLockup = transformUserLockup(rawUserLockup);
    incentivisedVotingLockup.userStakingReward = transformUserStakingReward(
      rawUserStakingReward,
    );
    incentivisedVotingLockup.userStakingBalance = transformUserStakingBalance(
      rawUserStakingBalance,
    );
  }

  return incentivisedVotingLockup;
};
