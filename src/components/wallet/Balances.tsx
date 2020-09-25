import React, { FC, useContext, useLayoutEffect, useState, useMemo } from 'react';
import styled, { ThemeContext, DefaultTheme } from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { useMetaToken, useToken } from '../../context/DataProvider/TokensProvider';
import { EtherscanLink } from '../core/EtherscanLink';
import { CountUp } from '../core/CountUp';
import { mapSizeToFontSize, Size } from '../../theme';
import { TokenIcon as TokenIconBase } from '../icons/TokenIcon';
import { List, ListItem } from '../core/List';
import { useDataState } from '../../context/DataProvider/DataProvider';

const Symbol = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 36px;
    margin-right: 8px;
  }
`;

const Balance = styled(CountUp) <{ size?: Size }>`
  font-weight: bold;
  font-size: ${({ size = Size.m }) => mapSizeToFontSize(size)};
`;

const TokenIcon = styled(TokenIconBase) <{ outline?: boolean }>`
  ${({ outline }) =>
    outline ? `border: 1px white solid; border-radius: 100%` : ''}
`;

const BalanceSkeleton: FC<{ themeContext: DefaultTheme }> = ({
  themeContext: theme,
}) => (
    <SkeletonTheme
      color={theme.color.blueTransparent}
      highlightColor={theme.color.blue}
    >
      <Skeleton width={200} height={30} />
    </SkeletonTheme>
  );

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC<{}> = () => {
  const [loading, setLoading] = useState(true);

  const dataState = useDataState() || {};
  const vmta = useToken(dataState.incentivisedVotingLockup?.address);
  const otherTokens = useMemo(() => (vmta ? [vmta] : []), [
    vmta,
  ]);
  const metaToken = useMetaToken();

  const themeContext = useContext(ThemeContext);

  // Use a layout effect to prevent CountUp from running if the component
  // is quickly unmounted (e.g. on login)
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
    return (): void => {
      clearTimeout(timeout);
    };
  }, [loading, setLoading]);

  return (
    <List inverted>
      <ListItem size={Size.l} key="mta">
        {metaToken ? (
          <>
            <Symbol>
              <TokenIcon symbol={metaToken.symbol} outline />
              <span>{metaToken.symbol}</span>
              <EtherscanLink data={metaToken.address} />
            </Symbol>
            {!metaToken.balance ? (
              <BalanceSkeleton themeContext={themeContext} />
            ) : (
                <Balance size={Size.l} end={metaToken.balance.simple} />
              )}
          </>
        ) : null}
      </ListItem>
      {otherTokens.map(({ address, symbol, balance }) => (
        <ListItem key={address}>
          <Symbol>
            <TokenIcon symbol={symbol} outline={symbol === 'vMTA'} />
            <span>{symbol}</span>
            <EtherscanLink data={address} />
          </Symbol>
          {balance ? (
            <Balance end={balance.simple} />
          ) : (
              <BalanceSkeleton themeContext={themeContext} />
            )}
        </ListItem>
      ))}
    </List>
  );
};
