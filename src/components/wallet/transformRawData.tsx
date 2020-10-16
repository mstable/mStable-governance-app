import {
  HistoricTransactionsQueryResult,
  TransactionType,
} from '../../graphql/mstable';
import { HistoricTransaction, HistoricTxsArr } from './types';
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

  const historicTxsData = [
    ...createLockTransactions,
    ...increaseLockAmountTransactions,
    ...increaseLockTimeTransactions,
    ...claimTransactions,
    ...withdrawTransactions,
  ].sort(
    (a, b) => parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10),
  ) as HistoricTxsArr;

  return historicTxsData.map(({ hash, ...tx }) => {
    const timestamp = parseInt(tx.timestamp, 10);
    const formattedDate = formatUnix(timestamp);
    switch (tx.type) {
      case TransactionType.Claim:
        return {
          type: tx.type,
          timestamp,
          formattedDate,
          hash,
          reward: new BigDecimal(tx.reward),
        };
      case TransactionType.CreateLock:
        return {
          type: tx.type,
          timestamp,
          formattedDate,
          hash,
          value: new BigDecimal(tx.value),
          lockTime: formatUnix(parseInt(tx.lockTime as string, 10)),
        };
      case TransactionType.IncreaseLockAmount:
        return {
          type: tx.type,
          timestamp,
          formattedDate,
          hash,
          value: new BigDecimal(tx.value),
        };
      case TransactionType.IncreaseLockTime:
        return {
          type: tx.type,
          timestamp,
          formattedDate,
          hash,
          lockTime: formatUnix(parseInt(tx.lockTime as string, 10)),
        };
      case TransactionType.Withdraw:
        return {
          type: tx.type,
          timestamp,
          formattedDate,
          hash,
          value: new BigDecimal(tx.value),
        };
      // Other cases

      default:
        throw new Error('Unhandled transaction type');
    }
  });
};
