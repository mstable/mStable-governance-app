import { BigNumber } from 'ethers/utils';
import { Tokens } from './TokensProvider';
import { UserLockupsQueryResult, Token } from '../../graphql/mstable';

export interface UserLockup {
  value: BigNumber;
  lockTime: number;
  ts: number;
  slope: BigNumber;
  bias: BigNumber;
}

export interface StakingReward {
  amount: BigNumber;
  amountPerTokenPaid: BigNumber;
}

export interface StakingBalance {
  amount: BigNumber;
}

export interface IncentivisedVotingLockup {
  address: string;
  userLockups: UserLockup[];
  stakingRewards: Array<StakingReward>;
  stakingBalances: Array<StakingBalance>;
  periodFinish: number;
  lastUpdateTime: number;
  stakingToken: Token;
  rewardPerTokenStored: BigNumber;
  duration: BigNumber;
  rewardRate: BigNumber;
  rewardsToken: Token;
  rewardsDistributor: { id: string; fundManagers: string[] };
  globalEpoch: BigNumber;
  expired: boolean;
  maxTime: BigNumber;
  totalStaticWeight: BigNumber;
  totalStakingRewards: BigNumber;
  totalValue: BigNumber;
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
