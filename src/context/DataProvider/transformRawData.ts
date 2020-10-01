import { BigNumber } from 'ethers/utils';
import { BigDecimal } from '../../utils/BigDecimal';
import { ONE_DAY, ONE_WEEK } from '../../utils/constants';
import { nowUnix } from '../../utils/time';
import {
  DataState,
  IncentivisedVotingLockup,
  RawData,
  UserStakingReward,
  UserLockup,
} from './types';

type RawIncentivisedVotingLockup = NonNullable<
  RawData['incentivisedVotingLockups'][0]
>;

const transformUserLockup = (
  data: RawIncentivisedVotingLockup['userLockups'][0] | undefined,
): UserLockup | undefined => {
  if (data) {
    const { value, bias, lockTime, slope, ts, ejected, ejectedHash } = data;

    return {
      value: new BigDecimal(value),
      bias: new BigDecimal(bias),
      slope: new BigNumber(slope),
      ts: parseInt(ts, 10),
      lockTime: parseInt(lockTime, 10),
      length: parseInt(lockTime, 10) - parseInt(ts, 10),
      ejected,
      ejectedHash,
    };
  }
  return undefined;
};

const transformUserStakingReward = (
  data: RawIncentivisedVotingLockup['stakingRewards'][0] | undefined,
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
  data: RawIncentivisedVotingLockup['stakingBalances'][0] | undefined,
): BigDecimal | undefined => {
  if (data) {
    return new BigDecimal(data.amount);
  }
  return undefined;
};

export const transformRawData = ({
  tokens,
  incentivisedVotingLockups: [
    incentivisedVotingLockupData,
  ] = ([] as unknown) as RawData['incentivisedVotingLockups'],
}: RawData): DataState => {
  if (!incentivisedVotingLockupData) {
    return { tokens };
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
    rewardsDistributor,
    rewardsToken,
    stakingBalances: [rawUserStakingBalance] = [],
    stakingRewards: [rawUserStakingReward] = [],
    stakingToken,
    totalStakingRewards,
    totalStaticWeight,
    totalValue,
    userLockups: [rawUserLockup] = [],
  } = incentivisedVotingLockupData;

  const userLockup = transformUserLockup(rawUserLockup);
  const userStakingReward = transformUserStakingReward(rawUserStakingReward);
  const userStakingBalance = transformUserStakingBalance(rawUserStakingBalance);

  // Get current unix
  const now = nowUnix();
  const unixWeekCount = Math.floor(now / ONE_WEEK.toNumber());
  const nextUnixWeek = (unixWeekCount + 1) * ONE_WEEK.toNumber();
  const minDays = Math.ceil((nextUnixWeek - now) / ONE_DAY.toNumber());
  // Min days = nextUniWeekStart - now

  // Max days = END - now
  // let maxDays = 365;
  const endBN = new BigNumber(end);
  const maxDays = Math.floor(
    (endBN.toNumber() - nextUnixWeek) / ONE_DAY.toNumber(),
  );

  const incentivisedVotingLockup: IncentivisedVotingLockup = {
    address,
    userLockup,
    userStakingBalance,
    userStakingReward,
    periodFinish,
    lastUpdateTime,
    stakingToken: {
      ...stakingToken,
      name: '',
    },
    rewardPerTokenStored: new BigDecimal(rewardPerTokenStored),
    duration: new BigNumber(duration),
    end: endBN,
    lockTimes: {
      min: minDays,
      max: maxDays,
    },
    rewardRate: new BigDecimal(rewardRate),
    rewardsToken: {
      ...rewardsToken,
      name: '',
    },
    rewardsDistributor,
    globalEpoch: new BigNumber(globalEpoch),
    expired,
    maxTime: new BigNumber(maxTime),
    totalStaticWeight: new BigDecimal(totalStaticWeight),
    totalStakingRewards: new BigDecimal(totalStakingRewards),
    totalValue: new BigDecimal(totalValue),
  };

  return {
    tokens,
    incentivisedVotingLockup,
  };
};
