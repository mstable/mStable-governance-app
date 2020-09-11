import { useEffect } from 'react';
import { useWallet } from 'use-wallet';

import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { useAccount } from '../context/UserProvider';

export const ContractsUpdater = (): null => {
  const { status, connector } = useWallet();
  const connected = status === 'connected';
  const account = useAccount();
  const { reset } = useTransactionsDispatch();

  /**
   * When the account changes, reset the transactions state.
   */
  useEffect(reset, [account, connector, connected, reset]);

  return null;
};
