import React, { FC } from 'react';

import { ApolloProvider } from './ApolloProvider';
import { TokensProvider } from './TokensProvider';
import { DataProvider } from './DataProvider';
import { BlockProvider } from './BlockProvider';

export const AllDataProviders: FC<{}> = ({ children }) => (
  <ApolloProvider>
    <TokensProvider>
      <BlockProvider>
        <DataProvider>{children}</DataProvider>
      </BlockProvider>
    </TokensProvider>
  </ApolloProvider>
);
