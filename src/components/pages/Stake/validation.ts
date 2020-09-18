import { Reasons, State } from './types';

const validateLock = ({
  amount,
  unlockTime,
  data,
}: State): [false, Reasons] | [true] => {
  if (!data.metaToken || !data.incentivisedVotingLockup) {
    return [false, Reasons.FetchingData];
  }

  const { metaToken } = data;
  if (!amount) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (amount.exact.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (unlockTime && unlockTime <= 0) {
    return [false, Reasons.PeriodMustBeSet];
  }

  if (amount.exact.gt(metaToken.balance.exact)) {
    return [false, Reasons.AmountMustNotExceedBalance];
  }

  if (
    !metaToken.allowances[data.incentivisedVotingLockup.address]?.exact.gte(
      amount.exact,
    )
  ) {
    return [false, Reasons.TransfersMustBeApproved];
  }
  return [true];
};

export const validate = (state: State): State => {
  const { touched } = state;
  const [valid, error] = touched ? validateLock(state) : [false];
  return {
    ...state,
    error,
    valid,
  };
};
