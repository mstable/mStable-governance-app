// eslint-disable-next-line import/no-unresolved
import { API, Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import init from 'bnc-onboard';
import { CHAIN_ID, rpcUrl } from '../utils/constants';

export const WALLETS = [
  { walletName: 'coinbase', preferred: true },
  { walletName: 'trust', preferred: true, rpcUrl },
  { walletName: 'metamask', preferred: true },
  {
    walletName: 'trezor',
    appUrl: window.location.hostname,
    email: 'info@mstable.org',
    rpcUrl,
    preferred: true,
  },
  {
    walletName: 'ledger',
    rpcUrl,
    preferred: true,
  },
  {
    walletName: 'lattice',
    rpcUrl,
    appName: 'mStable',
  },
  {
    walletName: 'fortmatic',
    apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
  },
  { walletName: 'authereum' },
  {
    walletName: 'walletConnect',
    infuraKey: process.env.REACT_APP_RPC_API_KEY,
    preferred: true,
  },
  { walletName: 'opera' },
  { walletName: 'operaTouch' },
  { walletName: 'torus' },
  { walletName: 'status' },
  { walletName: 'walletLink', rpcUrl, appName: 'mStable' },
  { walletName: 'imToken', rpcUrl },
  { walletName: 'meetone' },
  { walletName: 'mykey', rpcUrl },
  { walletName: 'huobiwallet', rpcUrl },
  { walletName: 'hyperpay' },
  { walletName: 'wallet.io', rpcUrl },
];

export const initOnboard = (subscriptions: Subscriptions): API => {
  return init({
    hideBranding: true,
    networkId: CHAIN_ID,
    subscriptions,
    walletSelect: {
      wallets: WALLETS,
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
    ],
  });
};
