import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

import * as Sentry from '@sentry/react';
import * as serviceWorker from './serviceWorker';
import { checkRequiredEnvVars } from './checkRequiredEnvVars';
import { DAPP_VERSION } from './utils/constants';
import { Providers } from './context';
import { Updaters } from './updaters';
import { Layout } from './components/layout/Layout';
import { StakeTabs } from './components/pages/Stake';
import { Discuss } from './components/pages/Discuss';
import { Govern } from './components/pages/Govern';
import { Stats } from './components/pages/Stats';

checkRequiredEnvVars();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: `mStable-governance-app@${DAPP_VERSION}`,
});

const Routes: FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/govern" />
      </Route>
      <Route exact path="/govern" component={Govern} />
      <Route exact path="/stake" component={StakeTabs} />
      <Route exact path="/stats" component={Stats} />
      <Route exact path="/discuss" component={Discuss} />
    </Switch>
  );
};

const Root: FC<{}> = () => {
  return (
    <HashRouter>
      <Providers>
        <Updaters />
        <Layout>
          <Routes />
        </Layout>
      </Providers>
    </HashRouter>
  );
};

ReactDOM.render(<Root />, document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
