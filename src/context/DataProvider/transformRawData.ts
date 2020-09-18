import { BigNumber } from 'ethers/utils';
import {
  DataState,
  IncentivisedVotingLockup,
  RawData,
  StakingBalance,
  StakingReward,
  UserLockup,
} from './types';

export const transformRawData = ({
  tokens,
  incentivisedVotingLockups: [incentivisedVotingLockupData],
}: RawData): DataState => {
  if (!incentivisedVotingLockupData) {
    return { tokens };
  }

  const {
    address,
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
    stakingBalances,
    stakingRewards,
    stakingToken,
    totalStakingRewards,
    totalStaticWeight,
    totalValue,
    userLockups,
  } = incentivisedVotingLockupData;

  const incentivisedVotingLockup: IncentivisedVotingLockup = {
    address,
    userLockups: userLockups.map<UserLockup>(
      ({ value, bias, slope, ts, lockTime }) => ({
        value: new BigNumber(value),
        bias: new BigNumber(bias),
        slope: new BigNumber(slope),
        ts: parseInt(ts, 10),
        lockTime: parseInt(lockTime, 10),
      }),
    ),
    stakingRewards: stakingRewards.map<StakingReward>(
      ({ amount, amountPerTokenPaid }) => ({
        amount: new BigNumber(amount),
        amountPerTokenPaid: new BigNumber(amountPerTokenPaid),
      }),
    ),
    stakingBalances: stakingBalances.map<StakingBalance>(({ amount }) => ({
      amount: new BigNumber(amount),
    })),
    periodFinish,
    lastUpdateTime,
    stakingToken: {
      ...stakingToken,
      name: '',
    },
    rewardPerTokenStored: new BigNumber(rewardPerTokenStored),
    duration: new BigNumber(duration),
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
