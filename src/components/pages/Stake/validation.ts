import { Reasons, State, TransactionType } from './types';

const validateLock = ({
  lockupAmount: { amount },
  lockupPeriod: { unlockTime, formValue: lockupPeriodFormValue },
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

  if (!unlockTime || unlockTime <= 0) {
    return [false, Reasons.PeriodMustBeSet];
  }

  if (transactionType === TransactionType.IncreaseLockTime) {
    if (!incentivisedVotingLockup?.userLockup) {
      return [false, Reasons.MustHaveAStakeToIncreaseLockTime];
    }

    if (lockupPeriodFormValue < 6) {
      return [false, Reasons.PeriodMustBeAtLeastSixDays];
    }

    // FIXME doesn't get triggered
    if (unlockTime <= incentivisedVotingLockup.userLockup.lockTime) {
      return [false, Reasons.NewLockupTimeMustBeAfterCurrentLockupTime];
    }

    return [true];
  }

  if (!amount) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (amount.exact.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

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

  if (transactionType === TransactionType.IncreaseLockAmount) {
    if (!incentivisedVotingLockup?.userLockup) {
      return [false, Reasons.MustHaveAStakeToIncreaseLockAmount];
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
