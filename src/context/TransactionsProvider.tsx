import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { TransactionReceipt, TransactionResponse } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';

import {
  Purpose,
  SendTxManifest,
  Transaction,
  TransactionStatus,
} from '../types';
import {
  useAddErrorNotification,
  useAddInfoNotification,
  useAddSuccessNotification,
} from './NotificationsProvider';
import { TransactionOverrides } from '../typechain/index.d';
import { getTransactionStatus } from '../utils/transactions';
import { getEtherscanLink } from '../utils/strings';

enum Actions {
  AddPending,
  Check,
  Finalize,
  Reset,
  ResetLatestStatus,
}

type TransactionHash = string;

interface State {
  current: Record<TransactionHash, Transaction>;
  latestStatus: { status?: TransactionStatus; blockNumber?: number };
}

interface Dispatch {
  /**
   * Add a single pending transaction
   */
  addPending(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    manifest: SendTxManifest<any, any>,
    pendingTx: { hash: string; response: TransactionResponse },
  ): void;

  /**
   * Check that a current transaction is present at a given block number.
   * @param hash
   * @param blockNumber
   */
  check(hash: string, blockNumber: number): void;

  /**
   * Mark a current transaction as finalized with a transaction receipt.
   * @param hash
   * @param receipt
   * @param tx
   */
  finalize(hash: string, receipt: TransactionReceipt, tx: Transaction): void;

  /**
   * Reset the state completely.
   */
  reset(): void;

  /**
   * Reset just the `latestStatus.status` field.
   */
  resetLatestStatus(): void;
}

type Action =
  | {
      type: Actions.AddPending;
      payload: Transaction;
    }
  | {
      type: Actions.Check;
      payload: { hash: string; blockNumber: number };
    }
  | {
      type: Actions.Finalize;
      payload: {
        hash: string;
        receipt: TransactionReceipt;
        status: TransactionStatus;
      };
    }
  | { type: Actions.Reset }
  | { type: Actions.ResetLatestStatus };

const transactionsCtxReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.AddPending: {
      return {
        ...state,
        current: {
          ...state.current,
          [action.payload.hash]: action.payload,
        },
        latestStatus: {
          ...state.latestStatus,
          status: TransactionStatus.Pending,
        },
      };
    }
    case Actions.Check: {
      const { hash, blockNumber } = action.payload;
      return {
        ...state,
        current: {
          ...state.current,
          [hash]: {
            ...state.current[hash],
            blockNumberChecked: blockNumber,
          },
        },
      } as State;
    }
    case Actions.Finalize: {
      const {
        hash,
        receipt: { status: rawStatus, blockNumber },
        status,
      } = action.payload;
      return {
        ...state,
        current: {
          ...state.current,
          [hash]: {
            ...state.current[hash],
            status: rawStatus as number,
            blockNumberChecked: blockNumber as number,
          },
        },
        latestStatus: { ...state.latestStatus, status },
      };
    }
    case Actions.Reset:
      return {
        historic: {},
        current: {},
        latestStatus: {},
      };
    case Actions.ResetLatestStatus:
      return {
        ...state,
        latestStatus: {
          ...state.latestStatus,
          status: undefined,
        },
      };
    default:
      throw new Error('Unhandled action');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>(null as any);

const initialState: State = {
  current: {},
  latestStatus: {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTxPurpose = ({ fn }: SendTxManifest<any, any>): Purpose => {
  switch (fn) {
    case 'claimReward':
      return {
        present: 'You are claiming MTA rewards',
        past: 'You claimed MTA rewards',
      };

    case 'createLock':
      return {
        present: 'You are staking MTA',
        past: 'You staked MTA',
      };

    case 'withdraw':
      return {
        present: 'You are exiting the staking contract',
        past: 'You exited the staking contract',
      };

    case 'approve':
      return {
        present: 'You are approving the staking contract to transfer your MTA',
        past: 'You approved the staking contract to transfer your MTA',
      };

    default:
      return {
        present: null,
        past: null,
      };
  }
};

const getEtherscanLinkForHash = (
  hash: string,
): { href: string; title: string } => ({
  title: 'View on Etherscan',
  href: getEtherscanLink(hash, 'transaction'),
});

/**
 * Provider for sending transactions and tracking their progress.
 */
export const TransactionsProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsCtxReducer, initialState);
  const addSuccessNotification = useAddSuccessNotification();
  const addInfoNotification = useAddInfoNotification();
  const addErrorNotification = useAddErrorNotification();

  const addPending = useCallback<Dispatch['addPending']>(
    (manifest, pendingTx) => {
      const purpose = getTxPurpose(manifest);
      dispatch({
        type: Actions.AddPending,
        payload: {
          ...pendingTx,
          ...(manifest.formId ? { formId: manifest.formId } : null),
          fn: manifest.fn,
          args: manifest.args,
          timestamp: Date.now(),
          purpose,
          status: null,
          onFinalize: manifest.onFinalized,
        },
      });

      addInfoNotification(
        'Transaction pending',
        purpose.present,
        getEtherscanLinkForHash(pendingTx.hash),
      );
    },
    [dispatch, addInfoNotification],
  );

  const check = useCallback<Dispatch['check']>(
    (hash, blockNumber) => {
      dispatch({ type: Actions.Check, payload: { hash, blockNumber } });
    },
    [dispatch],
  );

  const finalize = useCallback<Dispatch['finalize']>(
    (hash, receipt, tx) => {
      const status = getTransactionStatus(receipt);
      const link = getEtherscanLinkForHash(hash);

      if (status === TransactionStatus.Success) {
        addSuccessNotification('Transaction confirmed', tx.purpose.past, link);
      } else if (status === TransactionStatus.Error) {
        addErrorNotification('Transaction failed', tx.purpose.present, link);
      }

      dispatch({ type: Actions.Finalize, payload: { hash, receipt, status } });

      tx.onFinalize?.();
    },
    [dispatch, addSuccessNotification, addErrorNotification],
  );

  const reset = useCallback(() => {
    dispatch({ type: Actions.Reset });
  }, [dispatch]);

  const resetLatestStatus = useCallback(() => {
    dispatch({ type: Actions.ResetLatestStatus });
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            addPending,
            check,
            finalize,
            reset,
            resetLatestStatus,
          },
        ],
        [state, addPending, check, finalize, reset, resetLatestStatus],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useTransactionsContext = (): [State, Dispatch] =>
  useContext(context);

export const useTransactionsState = (): State => useTransactionsContext()[0];

export const useTransactionsDispatch = (): Dispatch =>
  useTransactionsContext()[1];

export const useOrderedCurrentTransactions = (
  formId?: string,
): Transaction[] => {
  const { current } = useTransactionsState();
  return useMemo(() => {
    const transactions = Object.values(current).sort(
      (a, b) => b.timestamp - a.timestamp,
    );
    return formId
      ? transactions.filter(t => t.formId === formId)
      : transactions;
  }, [current, formId]);
};

export const usePendingTxState = (): {
  latestStatus?: TransactionStatus;
  pendingCount: number;
} => {
  const {
    latestStatus: { status },
    current,
  } = useTransactionsState();
  return useMemo(
    () => ({
      latestStatus: status,
      pendingCount: Object.values(current).filter(tx => tx.status === null)
        .length,
    }),
    [status, current],
  );
};

export const useHasPendingApproval = (
  address: string,
  spender: string,
): boolean => {
  const { current } = useTransactionsState();
  return Object.values(current).some(
    tx =>
      tx.status !== 1 &&
      tx.fn === 'approve' &&
      tx.args[0] === spender &&
      tx.response.to === address,
  );
};

const overrideProps = ['nonce', 'gasLimit', 'gasPrice', 'value', 'chainId'];

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  const GAS_MARGIN = new BigNumber(1000);
  const offset = value.mul(GAS_MARGIN).div(new BigNumber(10000));
  return value.add(offset);
};

const isTransactionOverrides = (arg: unknown): boolean =>
  arg != null &&
  typeof arg === 'object' &&
  overrideProps.some(prop => Object.hasOwnProperty.call(arg, prop));

const addGasSettings = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: SendTxManifest<any, any>,
): Promise<typeof manifest> => {
  const { contract, fn, args } = manifest;
  const last = args[args.length - 1];

  if (
    isTransactionOverrides(last) &&
    !(last as TransactionOverrides).gasLimit
  ) {
    // Don't alter the manifest if the gas limit is already set
    return manifest;
  }

  // Set the gas limit (with the calculated gas margin)
  const gasLimit = await contract.estimate[fn](...args);

  // Also set the gas price, because some providers don't
  const gasPrice = await contract.provider.getGasPrice();

  return {
    ...manifest,
    args: [...args, { gasLimit: calculateGasMargin(gasLimit), gasPrice }],
  };
};

const sendTransaction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: SendTxManifest<any, any>,
): Promise<TransactionResponse> => {
  const { contract, fn, args } = await addGasSettings(manifest);
  return contract[fn](...args);
};

const parseTxError = (
  error: Error & { data?: { message: string } },
): string => {
  // MetaMask error messages are in a `data` property
  const txMessage = error.data?.message || error.message;

  return !txMessage || txMessage.includes('always failing transaction')
    ? 'Transaction failed - if this problem persists, contact mStable team.'
    : txMessage;
};

/**
 * Returns a callback that, given a manifest to send a transaction,
 * will create a promise to send the transaction, and add the response to state.
 */
export const useSendTransaction =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): ((tx: SendTxManifest<any, any>) => void) => {
    const [, { addPending }] = useTransactionsContext();
    const addErrorNotification = useAddErrorNotification();

    return useCallback(
      manifest => {
        sendTransaction(manifest)
          .then(response => {
            const { hash } = response;
            if (!hash) {
              addErrorNotification('Transaction failed to send: missing hash');
              return;
            }
            addPending(manifest, {
              hash,
              response: { ...response, to: response.to?.toLowerCase() },
            });
          })
          .catch(error => {
            const message = parseTxError(error);
            addErrorNotification(message);
          })
          .finally(() => {
            manifest.onSent?.();
          });
      },
      [addPending, addErrorNotification],
    );
  };
