import { FC } from 'react';
import { TransactionResponse } from 'ethers/providers';
import { Connectors } from 'use-wallet';
import { Ierc20 } from './typechain/Ierc20.d';
import { BigDecimal } from './utils/BigDecimal';
import { IIncentivisedVotingLockup } from './typechain/IIncentivisedVotingLockup.d';

export interface Transaction {
  formId?: string;
  hash: string;
  response: TransactionResponse;
  blockNumberChecked?: number;
  fn: string;
  status: number | null;
  timestamp: number;
  args: unknown[];
  purpose: Purpose;
  onFinalize?(): void;
}

export interface Purpose {
  present: string | null;
  past: string | null;
}

export enum TransactionStatus {
  Success,
  Error,
  Pending,
}

export enum Interfaces {
  ERC20,
  IncentivisedVotingLockup,
}

export interface Instances {
  [Interfaces.ERC20]: Ierc20;
  [Interfaces.IncentivisedVotingLockup]: IIncentivisedVotingLockup;
}

/**
 * Manifest for sending a transaction.
 *
 * @param contract: The contract interface, e.g. an instance of `Ierc20`
 * @param fn: Name of the function on the contract interface.
 * @param args: Array of arguments for the function.
 */
export interface SendTxManifest<
  TIface extends Interfaces,
  TFn extends keyof Instances[TIface]['functions']
> {
  contract: Instances[TIface];
  fn: Extract<keyof Instances[TIface]['functions'], TFn> & string;
  args: Parameters<
    Extract<
      Instances[TIface]['functions'][TFn],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => any
    >
  >;
  formId?: string;
  onSent?(): void;
  onFinalized?(): void;
}

export interface Token {
  address: string;
  decimals: number;
  symbol: string;
  totalSupply?: BigDecimal;
  price?: BigDecimal;
}

export interface Allowances {
  [spender: string]: BigDecimal;
}

export interface SubscribedToken extends Token {
  balance: BigDecimal;
  allowances: Allowances;
}

export interface InjectedEthereum {
  enable(): Promise<string[]>;
  on(event: 'chainChanged', listener: (chainId: number) => void): void;
  autoRefreshOnNetworkChange: boolean;
  removeListener(event: 'chainChanged', listener: Function): void;
  isMetaMask?: boolean;
  isBrave?: boolean;
  isTrust?: boolean;
  isDapper?: boolean;
}

export interface Connector {
  id: keyof Required<Connectors>;
  subType?: string;
  label: string;
  icon?: FC;
}

export interface AccentColors {
  light: string;
  accent: string;
  base: string;
  text: string;
}
