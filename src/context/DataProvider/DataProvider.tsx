import React, { createContext, FC, useContext, useMemo } from 'react';

import { useTokensState } from './TokensProvider';
import { RawData, DataState, IncentivisedVotingLockup } from './types';
import { transformRawData } from './transformRawData';
import { useUserLockupsSubscription } from './subscriptions';
import { useAccount } from '../UserProvider';

const dataStateCtx = createContext<DataState>({} as DataState);

const useRawData = (): RawData => {
  const { tokens } = useTokensState();
  const account = useAccount();
  const { data } = useUserLockupsSubscription(account);
  const incentivisedVotingLockups = (data?.incentivisedVotingLockups ??
    []) as RawData['incentivisedVotingLockups'];

  return {
    tokens,
    incentivisedVotingLockups,
  };
};

export const DataProvider: FC<{}> = ({ children }) => {
  const data = useRawData();
  const dataState = useMemo<DataState>(() => transformRawData(data), [data]);

  return (
    <dataStateCtx.Provider value={dataState}>{children}</dataStateCtx.Provider>
  );
};

export const useDataState = (): DataState => useContext(dataStateCtx);

export const useIncentivisedVotingLockup = ():
  | IncentivisedVotingLockup
  | undefined => useDataState().incentivisedVotingLockup;
