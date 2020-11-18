import { HistoricTransactionsQueryResult } from '../../graphql/mstable';
import { HistoricTransaction, HistoricTxsArr, TransactionType } from './types';
import { BigDecimal } from '../../utils/BigDecimal';
import { formatUnix } from '../../utils/time';

export const transformRawData = (
  data: HistoricTransactionsQueryResult['data'],
): HistoricTransaction[] => {
  if (!data) {
    return [];
  }

  const {
    claimTransactions,
    createLockTransactions,
    increaseLockAmountTransactions,
    increaseLockTimeTransactions,
    withdrawTransactions,
  } = data;

  return ([
    ...createLockTransactions,
    ...increaseLockAmountTransactions,
    ...increaseLockTimeTransactions,
    ...claimTransactions,
    ...withdrawTransactions,
  ] as HistoricTxsArr)
    .map(({ hash, ...tx }) => {
      const timestamp = parseInt(tx.timestamp, 10);
      const formattedDate = formatUnix(timestamp);
      switch (tx.__typename) {
        case TransactionType.ClaimTransaction:
          return {
            type: tx.__typename as TransactionType.ClaimTransaction,
            timestamp,
            formattedDate,
            hash,
            reward: new BigDecimal(tx.reward),
          };
        case TransactionType.CreateLockTransaction:
          return {
            type: tx.__typename as TransactionType.CreateLockTransaction,
            timestamp,
            formattedDate,
            hash,
            value: new BigDecimal(tx.value),
            lockTime: formatUnix(parseInt(tx.lockTime as string, 10)),
          };
        case TransactionType.IncreaseLockAmountTransaction:
          return {
            type: tx.__typename as TransactionType.IncreaseLockAmountTransaction,
            timestamp,
            formattedDate,
            hash,
            value: new BigDecimal(tx.value),
          };
        case TransactionType.IncreaseLockTimeTransaction:
          return {
            type: tx.__typename as TransactionType.IncreaseLockTimeTransaction,
            timestamp,
            formattedDate,
            hash,
            lockTime: formatUnix(parseInt(tx.lockTime as string, 10)),
          };
        case TransactionType.WithdrawTransaction:
          return {
            type: tx.__typename as TransactionType.WithdrawTransaction,
            timestamp,
            formattedDate,
            hash,
            value: new BigDecimal(tx.value),
          };
        // Other cases

        default:
          throw new Error('Unhandled transaction type');
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};
