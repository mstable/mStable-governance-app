import {
  DataState,
  IncentivisedVotingLockup,
  RawData,
  UserStakingReward,
  UserLockup,
} from './types';
import { BigDecimal } from '../../web3/BigDecimal';

type RawIncentivisedVotingLockup = NonNullable<
  RawData['incentivisedVotingLockups'][0]
>;

const transformUserLockup = (
  data: RawIncentivisedVotingLockup['userLockups'][0] | undefined,
): UserLockup | undefined => {
  if (data) {
    const { value, bias, lockTime, slope, ts } = data;
    return {
      value: new BigDecimal(value, 18),
      bias: new BigDecimal(bias, 18),
      slope: new BigDecimal(slope, 18),
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
      amount: new BigDecimal(amount, 18),
      amountPerTokenPaid: new BigDecimal(amountPerTokenPaid, 18),
      rewardsPaid: new BigDecimal(rewardsPaid, 18),
    };
  }
  return undefined;
};

const transformUserStakingBalance = (
  data: RawIncentivisedVotingLockup['stakingBalances'][0] | undefined,
): BigDecimal | undefined => {
  if (data) {
    return new BigDecimal(data.amount, 18);
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
    rewardPerTokenStored: new BigDecimal(rewardPerTokenStored, 18),
    duration: new BigDecimal(duration, 18),
    end: new BigDecimal(end, 18),
    rewardRate: new BigDecimal(rewardRate, 18),
    rewardsToken: {
      ...rewardsToken,
      name: '',
    },
    rewardsDistributor,
    globalEpoch: new BigDecimal(globalEpoch, 18),
    expired,
    maxTime: new BigDecimal(maxTime, 18),
    totalStaticWeight: new BigDecimal(totalStaticWeight, 18),
    totalStakingRewards: new BigDecimal(totalStakingRewards, 18),
    totalValue: new BigDecimal(totalValue, 18),
  };

  return {
    tokens,
    incentivisedVotingLockup,
  };
};
