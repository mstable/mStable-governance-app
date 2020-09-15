import { Reasons, State } from './types';

const validateLock = ({
  amount,
  lockUpPeriod,
  data
}: State): [false, Reasons] | [true] => {
  if (!data) {
    return [false, Reasons.FetchingData];
  }

  const { metaToken } = data;
  if (!amount) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (amount.exact.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (lockUpPeriod <= 0) {
    return [false, Reasons.PeriodMustBeMoreThanDay]
  }

  if (metaToken) {
    if (amount.exact.gt(metaToken.balance.exact)) {
      return [false, Reasons.AmountMustNotExceedBalance];
    }
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

