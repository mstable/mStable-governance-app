import React, { createContext, FC, useContext, useMemo } from 'react';
import { pipe } from 'ts-pipe-compose';
import useDebouncedMemo from '@sevenoutman/use-debounced-memo';

import { useTokensState } from './TokensProvider';
import { RawData, DataState, IncentivisedVotingLockup } from './types';
import { recalculateState } from './recalculateState';
import { transformRawData } from './transformRawData';
import { useUserLockupsSubscription } from './subscriptions';
import { useAccount } from '../UserProvider';

const dataStateCtx = createContext<DataState>({} as DataState);

const setDataState = (data: RawData): DataState => {
  return pipe<RawData, DataState, DataState>(
    data as RawData,
    transformRawData,
    recalculateState,
  );
};

const useRawData = (): RawData => {
  const { tokens } = useTokensState();
  const account = useAccount();
  const { data } = useUserLockupsSubscription(account as string);
  const incentivisedVotingLockups = data?.incentivisedVotingLockups ?? []

  return useDebouncedMemo(
    () => ({
      tokens,
      incentivisedVotingLockups
    }),
    [tokens, incentivisedVotingLockups],
    1000,
  );
};

export const DataProvider: FC<{}> = ({ children }) => {
  const data = useRawData();
  const dataState = useMemo<DataState>(() => setDataState(data), [
    data,
  ]);

  return (
    <dataStateCtx.Provider value={dataState}>{children}</dataStateCtx.Provider>
  );
};

export const useDataState = (): DataState =>
  useContext(dataStateCtx);

export const useIncentivisedVotingLockup = (): IncentivisedVotingLockup[] => useDataState().incentivisedVotingLockups

