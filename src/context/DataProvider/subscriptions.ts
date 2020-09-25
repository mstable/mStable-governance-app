import { LazyQueryHookOptions, QueryTuple } from '@apollo/react-hooks';
import { QueryResult } from '@apollo/react-common';
import { useEffect, useMemo, useRef } from 'react';
import { useBlockNumber } from './BlockProvider';
import {
  useUserLockupsLazyQuery,
  UserLockupsQueryResult,
} from '../../graphql/mstable';
import { useWeb3Provider } from '../SignerProvider';

import { BigDecimal } from '../../utils/BigDecimal';
import { Erc20DetailedFactory } from '../../typechain/Erc20DetailedFactory';

export const useBlockPollingSubscription = <TData, TVariables>(
  lazyQuery: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    options?: LazyQueryHookOptions<TData, TVariables>,
  ) => QueryTuple<TData, TVariables>,
  baseOptions?: LazyQueryHookOptions<TData, TVariables>,
  skip?: boolean,
): QueryResult<TData, TVariables> => {
  const blockNumber = useBlockNumber();
  const hasBlock = !!blockNumber;

  // We're using a long-polling query because subscriptions don't seem to be
  // re-run when derived or nested fields change.
  // See https://github.com/graphprotocol/graph-node/issues/1398
  const [run, query] = lazyQuery({
    fetchPolicy: 'cache-and-network',
    ...baseOptions,
  });

  // Long poll (15s interval) if the block number isn't available.
  useEffect(() => {
    let interval: number;

    if (!skip && !hasBlock) {
      run();
      interval = setInterval(() => {
        run();
      }, 15000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [skip, hasBlock, run]);

  // Run the query on every block when the block number is available.
  useEffect(() => {
    if (!skip && blockNumber) {
      run();
    }
  }, [skip, blockNumber, run]);

  return query as never;
};

export const useUserLockupsSubscription = (
  account?: string,
): UserLockupsQueryResult => {
  return useBlockPollingSubscription(useUserLockupsLazyQuery, {
    variables: { account: account as string },
  });
};

export const useTotalSupply = (
  address: string | null | undefined,
): BigDecimal => {
  const provider = useWeb3Provider();
  const blockNumber = useBlockNumber();

  const totalSupply = useRef(new BigDecimal(0));

  const contract = useMemo(
    () =>
      provider && address
        ? Erc20DetailedFactory.connect(address, provider)
        : undefined,
    [address, provider],
  );

  useEffect(() => {
    if (blockNumber && contract) {
      contract.totalSupply().then(_totalSupply => {
        if (!totalSupply.current.exact.eq(_totalSupply)) {
          totalSupply.current = new BigDecimal(_totalSupply);
        }
      });
    }
  }, [contract, blockNumber]);

  return totalSupply.current;
};
