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

export interface UserStakingReward {
  amount: BigNumber;
  amountPerTokenPaid: BigNumber;
}

// TODO use BigDecimal
export interface IncentivisedVotingLockup {
  address: string;
  duration: BigNumber;
  expired: boolean;
  globalEpoch: BigNumber;
  lastUpdateTime: number;
  maxTime: BigNumber;
  periodFinish: number;
  rewardPerTokenStored: BigNumber;
  rewardRate: BigNumber;
  rewardsDistributor: { id: string; fundManagers: string[] };
  rewardsToken: Token;
  stakingToken: Token;
  totalStakingRewards: BigNumber;
  totalStaticWeight: BigNumber;
  totalValue: BigNumber;
  userLockup?: UserLockup;
  userStakingBalance?: BigNumber;
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
