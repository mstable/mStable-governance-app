import React, { createContext, FC, useContext, useState } from 'react';
import { useInterval } from 'react-use';

import { useIsIdle } from '../UserProvider';
import { useProvider } from '../OnboardProvider';

export type MaybeBlockNumber = number | undefined;

const stateCtx = createContext<MaybeBlockNumber>(null as never);

export const BlockProvider: FC = ({ children }) => {
  const [blockNumber, setBlockNumber] = useState<MaybeBlockNumber>();
  const provider = useProvider();
  const idle = useIsIdle();

  useInterval(() => {
    if (!idle) {
      // Only set the new block number when the user is active
      // getBlockNumber apparently returns a string
      provider?.getBlockNumber().then(latest => {
        setBlockNumber(
          latest ? parseInt((latest as unknown) as string, 10) : undefined,
        );
      });
    }
  }, 15e3);

  return <stateCtx.Provider value={blockNumber}>{children}</stateCtx.Provider>;
};

export const useBlockNumber = (): MaybeBlockNumber => useContext(stateCtx);
