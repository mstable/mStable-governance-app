import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { useMetaToken } from '../../../context/DataProvider/TokensProvider';
import { useIncentivisedVotingLockup } from '../../../context/DataProvider/DataProvider';
import { Actions, Dispatch, State, TransactionType } from './types';
import { reducer } from './reducer';
import { IIncentivisedVotingLockupFactory } from '../../../typechain/IIncentivisedVotingLockupFactory';
import { useSignerContext } from '../../../context/SignerProvider';
import { IIncentivisedVotingLockup } from '../../../typechain/IIncentivisedVotingLockup';

const initialState: State = {
  data: {},
  lockupAmount: {
    formValue: null,
  },
  lockupPeriod: {
    formValue: 0,
  },
  touched: false,
  transactionType: TransactionType.CreateLock,
  valid: false,
};

const dispatchCtx = createContext<Dispatch>({} as never);

const stateCtx = createContext<State>({} as never);

const contractCtx = createContext<IIncentivisedVotingLockup | undefined>(
  undefined,
);

export const useStakeState = (): State => useContext(stateCtx);

export const useStakeDispatch = (): Dispatch => useContext(dispatchCtx);

export const useStakeContract = (): IIncentivisedVotingLockup | undefined =>
  useContext(contractCtx);

const StakeContractProvider: FC = ({ children }) => {
  const { address } = useIncentivisedVotingLockup() ?? {};
  const signer = useSignerContext();

  const contract = useMemo(
    () =>
      address && signer
        ? IIncentivisedVotingLockupFactory.connect(address, signer)
        : undefined,
    [address, signer],
  );

  return (
    <contractCtx.Provider value={contract}>{children}</contractCtx.Provider>
  );
};

export const StakeProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const metaToken = useMetaToken();
  const incentivisedVotingLockup = useIncentivisedVotingLockup();

  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: { metaToken, incentivisedVotingLockup },
    });
  }, [metaToken, incentivisedVotingLockup, dispatch]);

  const setLockupAmount = useCallback<Dispatch['setLockupAmount']>(
    amount => {
      dispatch({ type: Actions.SetLockupAmount, payload: amount });
    },
    [dispatch],
  );

  const setLockupDays = useCallback<Dispatch['setLockupDays']>(
    days => {
      dispatch({ type: Actions.SetLockupDays, payload: days });
    },
    [dispatch],
  );

  const setTransactionType = useCallback<Dispatch['setTransactionType']>(
    type => {
      dispatch({ type: Actions.SetTransactionType, payload: type });
    },
    [dispatch],
  );

  return (
    <dispatchCtx.Provider
      value={useMemo(
        () => ({
          setLockupAmount,
          setLockupDays,
          setTransactionType,
        }),
        [setLockupAmount, setLockupDays, setTransactionType],
      )}
    >
      <stateCtx.Provider value={state}>
        <StakeContractProvider>{children}</StakeContractProvider>
      </stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};
