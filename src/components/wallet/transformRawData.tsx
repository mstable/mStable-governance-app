import { HistoricTransactionsQueryResult } from '../../graphql/mstable';

export const transformRawData = (
  data: HistoricTransactionsQueryResult['data'],
): any | undefined => {
  if (!data) {
    return undefined;
  }
  const {
    claimTransactions,
    createLockTransactions,
    increaseLockAmountTransactions,
    increaseLockTimeTransactions,
    withdrawTransactions,
  } = data;

  const allTransactions: any = [
    ...createLockTransactions,
    ...increaseLockAmountTransactions,
    ...increaseLockTimeTransactions,
    ...claimTransactions,
    ...withdrawTransactions,
  ].sort((a, b) => parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10));

  return allTransactions;
};
