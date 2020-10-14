import React, { FC, createContext, useState, useMemo, useContext } from 'react';

import { IncentivisedVotingLockup } from '../../../context/DataProvider/types';
import { useIncentivisedVotingLockupsQuery } from '../../../graphql/mstable';
import { transformRawIncentivisedVotingLockups } from '../../../context/DataProvider/transformRawData';
import { useBlockNumber } from '../../../context/DataProvider/BlockProvider';

interface Context {
  block?: number;
  setBlock(block: number): void;
  incentivisedVotingLockup?: IncentivisedVotingLockup;
}

const ctx = createContext<Context>({} as never);

export const useIncentivisedVotingLockupAtBlock = (): Context =>
  useContext(ctx);

export const IncentivisedVotingLockupAtBlockProvider: FC = ({ children }) => {
  const blockNumber = useBlockNumber();
  const [block, setBlock] = useState<number>(blockNumber as number);

  const {
    data: incentivisedVotingLockupData,
  } = useIncentivisedVotingLockupsQuery({
    variables: {
      block: { number: block ?? 0 },
      hasBlock: !!block,
      hasAccount: false,
    },
  });

  const ctxValue = useMemo(() => {
    const incentivisedVotingLockup = transformRawIncentivisedVotingLockups(
      incentivisedVotingLockupData,
    );

    return {
      block,
      setBlock,
      incentivisedVotingLockup,
    };
  }, [block, incentivisedVotingLockupData]);

  return <ctx.Provider value={ctxValue}>{children}</ctx.Provider>;
};
