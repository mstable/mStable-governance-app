import { BigNumber } from 'ethers/utils';

export const SCALE = new BigNumber((1e18).toString());
export const PERCENT_SCALE = new BigNumber((1e16).toString());
export const RATIO_SCALE = new BigNumber((1e8).toString());
export const EXP_SCALE = new BigNumber((1e18).toString());

export const ONE_DAY = new BigNumber(60 * 60 * 24);
export const ONE_WEEK = new BigNumber(60 * 60 * 24 * 7);

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// For now, support one chain ID per deployment; also a `use-wallet` restriction
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID as string, 10);

export const NETWORK_NAMES = {
  1: 'Main Ethereum network',
  3: 'Ropsten (Test network)',
  42: 'Kovan (Test network)',
  1337: 'Local network',
};

export const EMOJIS = {
  error: '❌',
  approve: '✔️',
  createLock: '🔒',
  increaseLockAmount: '🔒',
  increaseLockLength: '🔒',
  withdraw: '🚪',
  claimReward: '🏆',
};

export const DAPP_VERSION = process.env.REACT_APP_VERSION;

export const rpcUrl = `${process.env.REACT_APP_RPC_URL}${process.env.REACT_APP_RPC_API_KEY}`;
