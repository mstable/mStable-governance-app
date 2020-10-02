import { Reasons, State, TransactionType } from './types';

const validateLock = ({
  lockupAmount: { amount },
  lockupPeriod: { unlockTime },
  transactionType,
  data: { metaToken, incentivisedVotingLockup },
}: State): [false, Reasons] | [true] => {
  if (
    !metaToken ||
    !incentivisedVotingLockup ||
    !metaToken.allowances[incentivisedVotingLockup.address]
  ) {
    return [false, Reasons.FetchingData];
  }
  if (transactionType === TransactionType.IncreaseLockTime) {
    return [true];
  }
  if (!amount) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (amount.exact.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (!unlockTime || unlockTime <= 0) {
    return [false, Reasons.PeriodMustBeSet];
  }

  // TODO should validate the existing lockup (for increasing the time)
  // if (formValue < 6) {
  //   return [false, Reasons.PeriodMustBeAtLeastSixDays];
  // }

  if (amount.exact.gt(metaToken.balance.exact)) {
    return [false, Reasons.AmountMustNotExceedBalance];
  }

  if (
    !metaToken.allowances[incentivisedVotingLockup.address].exact.gte(
      amount.exact,
    )
  ) {
    return [false, Reasons.AmountExceedsApprovedAmount];
  }

  return [true];
};

export const validate = (state: State): State => {
  const { touched } = state;

  // TODO different validation for different types
  const [valid, error] = touched ? validateLock(state) : [false];

  return {
    ...state,
    error,
    valid,
  };
};
