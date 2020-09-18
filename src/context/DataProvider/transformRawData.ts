import { BigNumber } from 'ethers/utils';
import { DataState, RawData, UserLockup } from './types';


export const transformRawData = ({ tokens, incentivisedVotingLockups }: RawData): DataState => {
  if (!incentivisedVotingLockups[0]) {
    return { tokens }
  }
  const { address, periodFinish,
    lastUpdateTime, duration, rewardRate, rewardsDistributor, globalEpoch, expired, stakingToken, rewardsToken, ...data } = incentivisedVotingLockups[0]
  const incentivisedVotingLockup = {
    address,
    userLockups: data.userLockups.map<UserLockup>(({ value, bias, slope, ts, lockTime }) => ({
      value: new BigNumber(value), bias: new BigNumber(bias), slope: new BigNumber(slope), ts: parseInt(ts, 10), lockTime: parseInt(lockTime, 10)
    })),
    stakingRewards: data.stakingRewards.map(({ amount, amountPerTokenPaid }) => ({
      amount: new BigNumber(amount),
      amountPerTokenPaid: new BigNumber(amountPerTokenPaid),
    })),
    stakingBalances: data.stakingBalances.map(({ amount }) => ({
      amount: new BigNumber(amount),
    })),
    periodFinish,
    lastUpdateTime,
    stakingToken: {
      ...stakingToken,
      name: ''
    },
    rewardPerTokenStored: new BigNumber(data.rewardPerTokenStored),
    duration: new BigNumber(duration),
    rewardRate: new BigNumber(rewardRate),
    rewardsToken: {
      ...rewardsToken,
      name: ''
    },
    rewardsDistributor,
    globalEpoch: new BigNumber(globalEpoch),
    expired,
    maxTime: new BigNumber(data.maxTime),
    totalStaticWeight: new BigNumber(data.totalStaticWeight),
    totalStakingRewards: new BigNumber(data.totalStakingRewards),
    totalValue: new BigNumber(data.totalValue),
  }
  return {
    tokens,
    incentivisedVotingLockup
  }
}
