import React, { createContext, FC, useContext, useMemo } from 'react';

import { DataState, IncentivisedVotingLockup } from './types';
import { transformRawIncentivisedVotingLockups } from './transformRawData';
import { useUserLockupsSubscription } from './subscriptions';
import { useAccount } from '../UserProvider';
import { IncentivisedVotingLockupsQueryResult } from '../../graphql/mstable';

const dataStateCtx = createContext<DataState>({} as DataState);

const useRawData = (): IncentivisedVotingLockupsQueryResult['data'] => {
  const account = useAccount();
  const { data } = useUserLockupsSubscription(account);
  return data;
};

export const DataProvider: FC = ({ children }) => {
  const data = useRawData();
  const dataState = useMemo<DataState>(() => {
    const incentivisedVotingLockup = transformRawIncentivisedVotingLockups(
      data,
    );
    return { incentivisedVotingLockup };
  }, [data]);

  return (
    <dataStateCtx.Provider value={dataState}>{children}</dataStateCtx.Provider>
  );
};

export const useDataState = (): DataState => useContext(dataStateCtx);

export const useIncentivisedVotingLockup = ():
  | IncentivisedVotingLockup
  | undefined => useDataState().incentivisedVotingLockup;
