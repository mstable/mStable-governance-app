import React, { createContext, FC, useContext, useMemo, useState } from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet';
import useIdle from 'react-use/lib/useIdle';

import { CHAIN_ID } from '../utils/constants';
import { AVAILABLE_CONNECTORS } from '../utils/connectors';

interface State {
  account?: string;
  masqueradedAccount?: string;
  idle: boolean;
}

interface Dispatch {
  masquerade(account?: string): void;
}

const dispatchCtx = createContext<Dispatch>({} as never);
const stateCtx = createContext<State>({
  idle: false,
});

export const useMasquerade = (): Dispatch['masquerade'] =>
  useContext(dispatchCtx).masquerade;

export const useUserState = (): State => useContext(stateCtx);

export const useIsIdle = (): State['idle'] => useUserState().idle;

export const useAccount = ():
  | State['masqueradedAccount']
  | State['account'] => {
  const { account, masqueradedAccount } = useUserState();
  return masqueradedAccount || account;
};

export const useOwnAccount = (): State['account'] => useUserState().account;

export const useIsMasquerading = (): boolean =>
  Boolean(useUserState().masqueradedAccount);

const AccountProvider: FC<{}> = ({ children }) => {
  const wallet = useWallet();
  const account = wallet.account || undefined;
  const idle = useIdle();
  const [masqueradedAccount, masquerade] = useState<
    State['masqueradedAccount']
  >();

  const state = useMemo<State>(() => ({ account, idle, masqueradedAccount }), [
    account,
    idle,
    masqueradedAccount,
  ]);

  return (
    <dispatchCtx.Provider value={useMemo(() => ({ masquerade }), [masquerade])}>
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const UserProvider: FC<{}> = ({ children }) => (
  <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
    <AccountProvider>{children}</AccountProvider>
  </UseWalletProvider>
);
