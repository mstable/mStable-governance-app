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
import { SubscribedToken } from '../../../types';

const initialState: State = {
  valid: false,
  touched: false,
  lockUpPeriod: 0,
  formValue: null,

};

const dispatchCtx = createContext<Dispatch>({} as never);

const stateCtx = createContext<State>({} as never);

const tokenCtx = createContext<SubscribedToken | undefined>(undefined);

export const useTokenCtx = ():
  | SubscribedToken
  | undefined => useContext(tokenCtx);

export const useGovernanceState = (): State => useContext(stateCtx);

export const useGovernanceDispatch = (): Dispatch =>
  useContext(dispatchCtx);

export const GovernanceProvider: FC<{}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const metaToken = useMetaToken();

  // eslint-disable-next-line no-console
  console.log('META TOKEN', metaToken);

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
        <tokenCtx.Provider value={metaToken}>
          {children}
        </tokenCtx.Provider>
      </stateCtx.Provider>
    </dispatchCtx.Provider >
  );
};
