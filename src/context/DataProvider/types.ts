import { BigNumber } from 'ethers/utils';
import { BigDecimal } from '../../utils/BigDecimal';
import { Token } from '../../types';

export interface UserLockup {
  value: BigDecimal;
  lockTime: number;
  lockDays: number;
  ts: number;
  slope: BigNumber;
  bias: BigDecimal;
  length: number;
  ejected: boolean;
  ejectedHash?: string | null | undefined;
}

export interface UserStakingReward {
  amount: BigDecimal;
  amountPerTokenPaid: BigDecimal;
  rewardsPaid: BigDecimal;
  currentAPY?: number;
  poolShare?: BigDecimal;
}

export interface LockTimes {
  min: number;
  max: number;
}

export interface IncentivisedVotingLockup {
  address: string;
  duration: BigNumber;
  start: BigNumber;
  end: BigNumber;
  lockTimes: LockTimes;
  expired: boolean;
  globalEpoch: BigNumber;
  lastUpdateTime: number;
  maxTime: BigNumber;
  periodFinish: number;
  rewardPerTokenStored: BigDecimal;
  rewardRate: BigDecimal;
  rewardsToken: Token;
  stakingToken: Token;
  votingToken: Token;
  totalStakingRewards: BigDecimal;
  totalStaticWeight: BigDecimal;
  totalStakers: number;
  totalValue: BigDecimal;
  userLockup?: UserLockup;
  userStakingBalance?: BigDecimal;
  userStakingReward?: UserStakingReward;
}

export interface DataState {
  incentivisedVotingLockup?: IncentivisedVotingLockup;
}
