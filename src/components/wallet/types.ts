import { BigDecimal } from '../../utils/BigDecimal';
import { HistoricTransactionsQueryResult } from '../../graphql/mstable';

type HistoricTxsData = NonNullable<HistoricTransactionsQueryResult['data']>;

export type HistoricTxsArr = Array<
  | HistoricTxsData['claimTransactions'][number]
  | HistoricTxsData['createLockTransactions'][number]
  | HistoricTxsData['increaseLockAmountTransactions'][number]
  | HistoricTxsData['increaseLockTimeTransactions'][number]
  | HistoricTxsData['withdrawTransactions'][number]
>;

export enum TransactionType {
  CreateLockTransaction = 'CreateLockTransaction',
  IncreaseLockAmountTransaction = 'IncreaseLockAmountTransaction',
  IncreaseLockTimeTransaction = 'IncreaseLockTimeTransaction',
  WithdrawTransaction = 'WithdrawTransaction',
  ClaimTransaction = 'ClaimTransaction',
}

interface BaseHistoricTransaction {
  type: TransactionType;
  hash: string;
  timestamp: number;
  formattedDate: string;
}

export interface ClaimTransaction extends BaseHistoricTransaction {
  type: TransactionType.ClaimTransaction;
  reward: BigDecimal;
}

export interface CreateLockTransaction extends BaseHistoricTransaction {
  type: TransactionType.CreateLockTransaction;
  value: BigDecimal;
  lockTime: string;
}

export interface IncreaseLockAmountTransaction extends BaseHistoricTransaction {
  type: TransactionType.IncreaseLockAmountTransaction;
  value: BigDecimal;
}

export interface IncreaseLockTimeTransaction extends BaseHistoricTransaction {
  type: TransactionType.IncreaseLockTimeTransaction;
  lockTime: string;
}

export interface WithdrawTransaction extends BaseHistoricTransaction {
  type: TransactionType.WithdrawTransaction;
  value: BigDecimal;
}

// Union type
export type HistoricTransaction =
  | ClaimTransaction
  | CreateLockTransaction
  | IncreaseLockAmountTransaction
  | IncreaseLockTimeTransaction
  | WithdrawTransaction;
