/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  FC,
  Reducer,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { Instances, Interfaces, SendTxManifest } from '../../../types';

interface State {
  formId: string;
  manifest?: SendTxManifest<never, never>;
  submitting: boolean;
}

interface Dispatch {
  setManifest<
    TIface extends Interfaces,
    TFn extends keyof Instances[TIface]['functions']
  >(
    manifest: SendTxManifest<TIface, TFn> | null,
  ): void;
  submitStart(): void;
  submitEnd(): void;
}

enum Actions {
  SetManifest,
  SubmitEnd,
  SubmitStart,
}

type Action =
  | {
      type: Actions.SetManifest;
      payload: SendTxManifest<never, never> | null;
    }
  | {
      type: Actions.SubmitEnd;
    }
  | {
      type: Actions.SubmitStart;
    };

const stateCtx = createContext<State>({} as any);

const dispatchCtx = createContext<Dispatch>({} as Dispatch);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetManifest: {
      const manifest = action.payload || undefined;
      return { ...state, manifest };
    }

    case Actions.SubmitEnd:
      return { ...state, submitting: false };

    case Actions.SubmitStart:
      return { ...state, submitting: true };

    default:
      throw new Error('Unhandled action type');
  }
};

export const FormProvider: FC<{ formId: string }> = ({ children, formId }) => {
  const [state, dispatch] = useReducer(reducer, { submitting: false, formId });

  const setManifest = useCallback<Dispatch['setManifest']>(
    manifest => {
      dispatch({ type: Actions.SetManifest, payload: manifest as any });
    },
    [dispatch],
  );

  const submitStart = useCallback<Dispatch['submitStart']>(() => {
    dispatch({ type: Actions.SubmitStart });
  }, [dispatch]);

  const submitEnd = useCallback<Dispatch['submitEnd']>(() => {
    dispatch({ type: Actions.SubmitEnd });
  }, [dispatch]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setManifest,
            submitEnd,
            submitStart,
          }),
          [setManifest, submitEnd, submitStart],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

const useStateCtx = (): State => useContext(stateCtx) as State;

const useDispatchCtx = (): Dispatch => useContext(dispatchCtx) as Dispatch;

export const useManifest = (): State['manifest'] => useStateCtx().manifest;

export const useFormSubmitting = (): State['submitting'] =>
  useStateCtx().submitting;

export const useFormId = (): State['formId'] => useStateCtx().formId;

export const useSetFormManifest = (): Dispatch['setManifest'] =>
  useDispatchCtx().setManifest;

export const useSubmitStart = (): Dispatch['submitStart'] =>
  useDispatchCtx().submitStart;

export const useSubmitEnd = (): Dispatch['submitEnd'] =>
  useDispatchCtx().submitEnd;
