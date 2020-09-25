import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { useRoutes, useRedirect } from 'hookrouter';

import * as Sentry from '@sentry/react';

import * as serviceWorker from './serviceWorker';
import { checkRequiredEnvVars } from './checkRequiredEnvVars';
import { DAPP_VERSION } from './utils/constants';
import { Providers } from './context';
import { Updaters } from './updaters';
import { Layout } from './components/layout/Layout';
import { NotFound } from './components/pages/NotFound';
import { StakeTabs } from './components/pages/Stake';
import { Discuss } from './components/pages/Discuss';
import { Govern } from './components/pages/Govern';

checkRequiredEnvVars();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: `mStable-governance-app@${DAPP_VERSION}`,
});

const routes = {
  '/govern': () => <Govern />,
  '/stake': () => <StakeTabs />,
  '/discuss': () => <Discuss />,
};

const Root: FC<{}> = () => {
  useRedirect('/', '/govern');
  const routeResult = useRoutes(routes);
  return (
    <Providers>
      <Updaters />
      <Layout>{routeResult || <NotFound />}</Layout>
    </Providers>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
