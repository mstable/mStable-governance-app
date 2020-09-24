import { BigNumber } from 'ethers/utils';
import { Tokens } from './TokensProvider';
import { UserLockupsQueryResult, Token } from '../../graphql/mstable';
import { BigDecimal } from '../../web3/BigDecimal';

export interface UserLockup {
  value: BigDecimal;
  lockTime: number;
  ts: number;
  slope: BigNumber;
  bias: BigNumber;
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
  end: BigNumber;
  lockTimes: LockTimes;
  expired: boolean;
  globalEpoch: BigNumber;
  lastUpdateTime: number;
  maxTime: BigNumber;
  periodFinish: number;
  rewardPerTokenStored: BigDecimal;
  rewardRate: BigDecimal;
  rewardsDistributor: { id: string; fundManagers: string[] };
  rewardsToken: Token;
  stakingToken: Token;
  totalStakingRewards: BigDecimal;
  totalStaticWeight: BigDecimal;
  totalValue: BigDecimal;
  userLockup?: UserLockup;
  userStakingBalance?: BigDecimal;
  userStakingReward?: UserStakingReward;
}

export interface RawData {
  tokens: Tokens;
  incentivisedVotingLockups: [
    | NonNullable<
        UserLockupsQueryResult['data']
      >['incentivisedVotingLockups'][0]
    | undefined,
  ];
}

export interface DataState {
  tokens: Tokens;
  incentivisedVotingLockup?: IncentivisedVotingLockup;
}
