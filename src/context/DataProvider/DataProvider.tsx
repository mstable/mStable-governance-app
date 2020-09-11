import React, { createContext, FC, useContext, useMemo } from 'react';
import { pipe } from 'ts-pipe-compose';
import useDebouncedMemo from '@sevenoutman/use-debounced-memo';

import { useTokensState } from './TokensProvider';
import { RawData, PartialRawData, DataState } from './types';
import { recalculateState } from './recalculateState';
import { transformRawData } from './transformRawData';

const dataStateCtx = createContext<DataState | undefined>(undefined);

const setDataState = (data: PartialRawData): DataState => {
  return pipe<RawData, DataState, DataState>(
    data as RawData,
    transformRawData,
    recalculateState,
  );
};

const useRawData = (): PartialRawData => {
  const { tokens } = useTokensState();

  return useDebouncedMemo(
    () => ({
      tokens,
    }),
    [tokens],
    1000,
  );
};

export const DataProvider: FC<{}> = ({ children }) => {
  const data = useRawData();

  const dataState = useMemo<DataState | undefined>(() => setDataState(data), [
    data,
  ]);

  return (
    <dataStateCtx.Provider value={dataState}>{children}</dataStateCtx.Provider>
  );
};

export const useDataState = (): DataState | undefined =>
  useContext(dataStateCtx);
