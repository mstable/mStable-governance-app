import { BigDecimal } from '../../utils/BigDecimal';
import {
  HistoricTransactionsQueryResult,
  TransactionType,
} from '../../graphql/mstable';

type HistoricTxsData = NonNullable<HistoricTransactionsQueryResult['data']>;

export type HistoricTxsArr = Array<
  | (HistoricTxsData['claimTransactions'][number] & {
      type: TransactionType.Claim;
    })
  | (HistoricTxsData['createLockTransactions'][number] & {
      type: TransactionType.CreateLock;
    })
  | (HistoricTxsData['increaseLockAmountTransactions'][number] & {
      type: TransactionType.IncreaseLockAmount;
    })
  | (HistoricTxsData['increaseLockTimeTransactions'][number] & {
      type: TransactionType.IncreaseLockTime;
    })
  | (HistoricTxsData['withdrawTransactions'][number] & {
      type: TransactionType.Withdraw;
    })
>;

interface BaseHistoricTransaction {
  hash: string;
  timestamp: number;
  formattedDate: string;
  type: TransactionType;
}

export interface ClaimTransaction extends BaseHistoricTransaction {
  type: TransactionType.Claim;
  reward: BigDecimal;
}

export interface CreateLockTransaction extends BaseHistoricTransaction {
  type: TransactionType.CreateLock;
  value: BigDecimal;
  lockTime: string;
}

export interface IncreaseLockAmountTransaction extends BaseHistoricTransaction {
  type: TransactionType.IncreaseLockAmount;
  value: BigDecimal;
}

export interface IncreaseLockTimeTransaction extends BaseHistoricTransaction {
  type: TransactionType.IncreaseLockTime;
  lockTime: string;
}

export interface WithdrawTransaction extends BaseHistoricTransaction {
  type: TransactionType.Withdraw;
  value: BigDecimal;
}

// Union type
export type HistoricTransaction =
  | ClaimTransaction
  | CreateLockTransaction
  | IncreaseLockAmountTransaction
  | IncreaseLockTimeTransaction
  | WithdrawTransaction;
