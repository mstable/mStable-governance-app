import { HistoricTransactionsQueryResult } from '../../graphql/mstable';

// TODO: Figure out the proper type to use for HistoricTransactionsData
export type HistoricTransactionsData = [
  NonNullable<
    HistoricTransactionsQueryResult['data']
  >['createLockTransactions'],
  NonNullable<
    HistoricTransactionsQueryResult['data']
  >['increaseLockAmountTransactions'],
  NonNullable<
    HistoricTransactionsQueryResult['data']
  >['increaseLockTimeTransactions'],
  NonNullable<HistoricTransactionsQueryResult['data']>['claimTransactions'],
  NonNullable<HistoricTransactionsQueryResult['data']>['withdrawTransactions'],
];

export interface HistoricTransaction {
  hash: string;
  timestamp: string;
  type: string;
  lockTime?: string;
  value?: string;
  reward?: string;
}
