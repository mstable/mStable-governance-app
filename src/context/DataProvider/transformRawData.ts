import { BigNumber } from 'ethers/utils';
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
    const { value, bias, lockTime, slope, ts } = data;
    return {
      value: new BigNumber(value),
      bias: new BigNumber(bias),
      slope: new BigNumber(slope),
      ts: parseInt(ts, 10),
      lockTime: parseInt(lockTime, 10),
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
      amount: new BigNumber(amount),
      amountPerTokenPaid: new BigNumber(amountPerTokenPaid),
      rewardsPaid: new BigNumber(rewardsPaid),
    };
  }
  return undefined;
};

const transformUserStakingBalance = (
  data: RawIncentivisedVotingLockup['stakingBalances'][0] | undefined,
): BigNumber | undefined => {
  if (data) {
    return new BigNumber(data.amount);
  }
  return undefined;
};

export const transformRawData = ({
  tokens,
  incentivisedVotingLockups: [incentivisedVotingLockupData],
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
    stakingBalances: [rawUserStakingBalance],
    stakingRewards: [rawUserStakingReward],
    stakingToken,
    totalStakingRewards,
    totalStaticWeight,
    totalValue,
    userLockups: [rawUserLockup],
  } = incentivisedVotingLockupData;

  const userLockup = transformUserLockup(rawUserLockup);
  const userStakingReward = transformUserStakingReward(rawUserStakingReward);
  const userStakingBalance = transformUserStakingBalance(rawUserStakingBalance);

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
    rewardPerTokenStored: new BigNumber(rewardPerTokenStored),
    duration: new BigNumber(duration),
    end: new BigNumber(end),
    rewardRate: new BigNumber(rewardRate),
    rewardsToken: {
      ...rewardsToken,
      name: '',
    },
    rewardsDistributor,
    globalEpoch: new BigNumber(globalEpoch),
    expired,
    maxTime: new BigNumber(maxTime),
    totalStaticWeight: new BigNumber(totalStaticWeight),
    totalStakingRewards: new BigNumber(totalStakingRewards),
    totalValue: new BigNumber(totalValue),
  };

  return {
    tokens,
    incentivisedVotingLockup,
  };
};
