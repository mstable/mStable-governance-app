import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from 'react';
import { Dispatch, State, Actions } from './types';
import { reducer } from './reducer';
import { useMetaToken } from '../../../context/DataProvider/TokensProvider';

const initialState: State = {
  valid: false,
  touched: false,
  lockUpPeriod: 0,
  formValue: null,
  data: {}
};

const dispatchCtx = createContext<Dispatch>({} as never);

const stateCtx = createContext<State>({} as never);

export const useGovernanceState = (): State => useContext(stateCtx);

export const useGovernanceDispatch = (): Dispatch =>
  useContext(dispatchCtx);

export const GovernanceProvider: FC<{}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const metaToken = useMetaToken();

  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: { metaToken },
    });
  }, [metaToken, dispatch]);

  const setVoteAmount = useCallback<Dispatch['setVoteAmount']>(
    amount => {
      dispatch({ type: Actions.SetVoteAmount, payload: amount });
    },
    [dispatch],
  );

  const setLockUpPeriod = useCallback<Dispatch['setLockUpPeriod']>(
    lockUpPeriod => {
      dispatch({ type: Actions.SetLockUpPeriod, payload: lockUpPeriod });
    },
    [dispatch],
  );

  return (
    <dispatchCtx.Provider
      value={useMemo(
        () => ({
          setVoteAmount,
          setLockUpPeriod
        }), [setVoteAmount, setLockUpPeriod])}
    >
      <stateCtx.Provider value={state}>
        {children}
      </stateCtx.Provider>
    </dispatchCtx.Provider >
  );
};