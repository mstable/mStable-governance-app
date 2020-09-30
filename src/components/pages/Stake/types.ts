import { BigDecimal } from '../../../utils/BigDecimal';
import { SubscribedToken } from '../../../types';
import {
  IncentivisedVotingLockup,
  UserLockup,
  UserStakingReward,
} from '../../../context/DataProvider/types';

export interface RewardsEarned {
  rewards?: BigDecimal;
  rewardsUsd?: BigDecimal;
}

export interface SimulatedData {
  totalStaticWeight: BigDecimal;
  totalValue: BigDecimal;
  userLockup?: UserLockup;
  userStakingBalance?: BigDecimal;
  userStakingReward?: UserStakingReward;
}

export enum TransactionType {
  Claim = 'Claim',
  CreateLock = 'CreateLock',
  IncreaseLockAmount = 'IncreaseLockAmount',
  IncreaseLockTime = 'IncreaseLockTime',
  Withdraw = 'Withdraw',
}

export interface State {
  data: {
    metaToken?: SubscribedToken;
    incentivisedVotingLockup?: IncentivisedVotingLockup;
    simulatedData?: SimulatedData;
  };
  error?: string;
  lockupAmount: {
    formValue: string | null;
    amount?: BigDecimal;
  };
  lockupPeriod: {
    formValue: number;
    unlockTime?: number;
  };
  touched?: boolean;
  transactionType: TransactionType;
  valid: boolean;
}

export enum Reasons {
  FetchingData = 'Failed to fetch data',
  AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
  AmountMustBeSet = 'Amount must be set',
  PeriodMustBeSet = 'Lockup period must be set',
  PeriodMustBeAtLeastSixDays = 'Lockup period must be at least six days',
  AmountMustNotExceedBalance = 'Amount must not exceed balance',
  AmountExceedsApprovedAmount = 'Amount exceeds approved amount',
}

export interface Dispatch {
  setLockupAmount(formValue: string): void;
  setLockupDays(days: number): void;
  setTransactionType(type: TransactionType): void;
  setMaxLockupAmount(): void;
  setMaxLockupDays(max: number): void;
  toggleTransactionType(): void;
}

export enum Actions {
  Data,
  SetLockupAmount,
  SetMaxLockupAmount,
  SetMaxLockupDays,
  SetLockupDays,
  SetTransactionType,
  ToggleTransactionType,
}

export type Action =
  | {
    type: Actions.Data;
    payload: {
      metaToken?: SubscribedToken;
      incentivisedVotingLockup?: IncentivisedVotingLockup;
      rewards?: RewardsEarned;
    };
  }
  | { type: Actions.SetLockupAmount; payload: string }
  | { type: Actions.SetLockupDays; payload: number }
  | { type: Actions.SetMaxLockupAmount }
  | { type: Actions.SetMaxLockupDays; payload: number }
  | { type: Actions.SetTransactionType; payload: TransactionType }
  | { type: Actions.ToggleTransactionType };
