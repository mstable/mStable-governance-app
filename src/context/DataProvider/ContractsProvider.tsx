import React, { createContext, FC, useMemo } from 'react';
import { useSignerContext } from '../SignerProvider';
import { Erc20Detailed } from '../../typechain/Erc20Detailed.d';
import { Erc20DetailedFactory } from '../../typechain/Erc20DetailedFactory';

// TODO add staking contracts
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

const context = createContext<State>({} as State);

export const ContractsProvider: FC<{}> = ({ children }) => {
  // const signer = useSignerContext();

  const state = useMemo<State>(() => ({}), []);

  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useErc20Contract = (
  address: string | null,
): Erc20Detailed | null => {
  const signer = useSignerContext();
  return useMemo(
    () =>
      signer && address ? Erc20DetailedFactory.connect(address, signer) : null,
    [address, signer],
  );
};
