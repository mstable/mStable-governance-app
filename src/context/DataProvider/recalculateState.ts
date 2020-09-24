import { DataState, IncentivisedVotingLockup } from './types';
import { ONE_DAY } from '../../web3/constants';
import { BigDecimal } from '../../web3/BigDecimal';

// TODO
export const recalculateState = ({
  tokens,
  incentivisedVotingLockup,
}: DataState): DataState => {
  if (
    !incentivisedVotingLockup ||
    !incentivisedVotingLockup.userStakingReward ||
    !incentivisedVotingLockup.userStakingBalance ||
    !incentivisedVotingLockup.userLockup
  ) {
    return { tokens, incentivisedVotingLockup };
  }

  const r = incentivisedVotingLockup.rewardRate;
  const t = incentivisedVotingLockup.totalStaticWeight;
  const b = incentivisedVotingLockup.userStakingBalance;
  const v = incentivisedVotingLockup.userLockup.value;

  const dailyRewards = new BigDecimal(ONE_DAY.mul(r.exact), 18); // e.g. 100
  const share = b.divPrecisely(t); // e.g. 0.2
  // apy = (daily return) * 365
  // daily return = daily rewards / share
  const dailyReturn = dailyRewards.mulTruncate(share.exact);
  const dailyReturnRate = dailyReturn.divPrecisely(v);
  const apy = dailyReturnRate.simple * 365 * 100;

  const recalculated: IncentivisedVotingLockup = {
    ...incentivisedVotingLockup,
    userStakingReward: {
      ...incentivisedVotingLockup.userStakingReward,
      currentAPY: apy,
    },
  };
  return { tokens, incentivisedVotingLockup: recalculated };
};
