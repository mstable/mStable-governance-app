import { ONE_DAY } from '../../../utils/constants';
import { BigDecimal } from '../../../utils/BigDecimal';

export interface PoolShare {
  apy: number;
  share: BigDecimal;
}

export const getShareAndAPY = (
  rewardRate: BigDecimal,
  totalStaticWeight: BigDecimal,
  userStakingBalance: BigDecimal,
  lockup: BigDecimal,
): PoolShare => {
  const r = rewardRate;
  const t = totalStaticWeight;
  const b = userStakingBalance;
  const v = lockup;

  if (v.simple === 0) {
    return {
      apy: 0,
      share: new BigDecimal(0),
    };
  }

  const dailyRewards = new BigDecimal(ONE_DAY.mul(r.exact)); // e.g. 100
  const share = b.divPrecisely(t); // e.g. 0.2
  // apy = (daily return) * 365
  // daily return = daily rewards / share
  const dailyReturn = dailyRewards.mulTruncate(share.exact);
  const dailyReturnRate = dailyReturn.divPrecisely(v);
  const apy = dailyReturnRate.simple * 365 * 100;
  return {
    apy,
    share: new BigDecimal(share.exact.mul(100)),
  };
};
