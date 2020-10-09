const REQUIRED_ENV_VARS: (keyof typeof process.env)[] = [
  'REACT_APP_GRAPHQL_ENDPOINT_MSTABLE_GOV',
  'REACT_APP_MTA_ADDRESS',
  'REACT_APP_CHAIN_ID',
  'REACT_APP_RPC_URL',
];

export const checkRequiredEnvVars = (): void => {
  REQUIRED_ENV_VARS.forEach(name => {
    if (typeof process.env[name] === 'undefined') {
      throw new Error(`Required env var "${name}"`);
    }
  });
};
