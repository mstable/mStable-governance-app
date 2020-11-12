import styled from 'styled-components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import {
  AccountItems,
  StatusWarnings,
  useAppStatusWarnings,
  useCloseAccount,
  useIsWalletConnecting,
  useAccountItem,
  useAccountOpen,
  useResetWallet,
  useToggleNotifications,
  useToggleWallet,
  useWalletConnector,
} from '../../context/AppProvider';
import { useOwnAccount } from '../../context/UserProvider';
import { Color, ViewportWidth } from '../../theme';
import { ReactComponent as LogoSvg } from '../icons/mstable.svg';
import { UnstyledButton } from '../core/Button';
import { centredLayout } from './css';
import { InjectedEthereum, TransactionStatus } from '../../types';
import { useTruncatedAddress } from '../../utils/hooks';
import { usePendingTxState } from '../../context/TransactionsProvider';
import {
  NotificationType,
  useUnreadNotifications,
} from '../../context/NotificationsProvider';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { Idle } from '../icons/Idle';

const statusWarnings: Record<
  StatusWarnings,
  { label: string; error?: boolean }
> = {
  [StatusWarnings.UnsupportedChain]: {
    label: 'Unsupported chain',
    error: true,
  },
  [StatusWarnings.NotOnline]: {
    label: 'Not online',
  },
};

const CountBadgeIcon = styled.div<{ error: boolean; count: number }>`
  background: ${({ error, count }) =>
    error ? Color.blue : count === 0 ? Color.greyTransparent : Color.blue};
  font-weight: bold;
  font-size: 11px;
  width: 17px;
  height: 17px;
  border-radius: 100%;
  color: ${Color.white};
  text-align: center;
  line-height: 17px;
`;

const CountBadge: FC<{ count: number; error: boolean }> = ({
  count,
  error,
}) => (
  <CountBadgeIcon error={error} count={count}>
    {count}
  </CountBadgeIcon>
);

const Logo = styled.div<{ inverted?: boolean }>`
  a {
    border-bottom: 0;
  }

  svg {
    width: 20px;
    height: 24px;

    path,
    rect {
      fill: ${({ theme, inverted }) => (inverted ? theme.color.white : 'auto')};
    }
  }
`;

const AccountButton = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  height: 24px;
  line-height: 100%;
  padding: 0 8px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  border-bottom: 4px transparent solid;
  border-bottom-color: ${({ active }) =>
    active ? Color.white : 'transparent'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }

  ${CountBadgeIcon} {
    margin-top: -1px;
  }

  &:hover {
    border-bottom-color: ${({ active }) =>
      active ? Color.white : Color.blackTransparent};
  }
`;

const TruncatedAddress = styled.span`
  //font-weight: normal;
  text-transform: none;
`;

const WalletButtonBtn = styled(AccountButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    > svg {
      width: 16px;
      height: 16px;

      @media (min-width: ${ViewportWidth.m}) {
        width: 28px;
        height: 28px;
      }
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;

  > * {
    font-size: 16px;
    margin-right: 6px;
    &:last-child {
      margin-right: 0;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    > * {
      margin-right: 16px;
    }
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Inner = styled.div`
  padding: 0 20px;
  height: 100%;

  ${centredLayout}
`;

const Container = styled.div<{ inverted: boolean }>`
  background: ${({ inverted }) => (inverted ? Color.black : Color.white)};
  height: 48px;
  display: flex;
  justify-content: center;
  padding-top: 2px;

  ${AccountButton} {
    color: ${({ inverted }) => (inverted ? Color.white : Color.offBlack)};
  }
`;

const useWalletIcon = (): FC<{}> | null => {
  const connector = useWalletConnector();

  if (connector) {
    return connector.icon || null;
  }

  return null;
};

const StatusWarning = styled.div<{ error?: boolean }>`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  color: ${({ error }) => (error ? Color.red : Color.offBlack)};
  background: ${Color.white};
  border-right: 1px ${Color.red} solid;
  border-bottom: 1px ${Color.red} solid;
  padding: 8px 16px;
`;

const StatusWarningsRowContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  > * {
    margin-right: 16px;
  }
`;

const StatusWarningsRow: FC<{}> = () => {
  const warnings = useAppStatusWarnings();

  return (
    <StatusWarningsRowContainer>
      {warnings.map(warning => (
        <StatusWarning key={warning} error={statusWarnings[warning].error}>
          {statusWarnings[warning].label}
        </StatusWarning>
      ))}
    </StatusWarningsRowContainer>
  );
};

const NotificationsButton: FC<{}> = () => {
  const accountItem = useAccountItem();
  const toggleNotifications = useToggleNotifications();
  const unread = useUnreadNotifications();
  const hasUnreadErrors = unread.some(n => n.type === NotificationType.Error);

  return (
    <AccountButton
      onClick={toggleNotifications}
      active={accountItem === AccountItems.Notifications}
    >
      <span>Notifications</span>
      <CountBadge count={unread.length} error={hasUnreadErrors} />
    </AccountButton>
  );
};

const PendingTxContainer = styled.div<{
  pending: boolean;
  error: boolean;
  success: boolean;
}>`
  width: 17px;
  height: 17px;
  position: relative;
  margin-top: -1px;
  transition: color 0.5s ease;
  color: ${({ error, pending, success, theme }) =>
    error
      ? theme.color.red
      : success
      ? theme.color.green
      : pending
      ? theme.color.blue
      : theme.color.greyTransparent};
  font-weight: bold;
  font-size: 11px;
  text-align: center;
  line-height: 17px;

  > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const WalletButton: FC<{}> = () => {
  const accountItem = useAccountItem();
  const toggleWallet = useToggleWallet();
  const resetWallet = useResetWallet();
  const { status } = useWallet<InjectedEthereum>();
  const connected = status === 'connected';
  const account = useOwnAccount();
  const connecting = useIsWalletConnecting();
  const truncatedAddress = useTruncatedAddress(account);
  const WalletIcon = useWalletIcon();

  const { pendingCount, latestStatus } = usePendingTxState();
  const pending =
    (!latestStatus && connecting) || latestStatus === TransactionStatus.Pending;
  const error = latestStatus === TransactionStatus.Error;
  const success =
    (!latestStatus && connected) || latestStatus === TransactionStatus.Success;

  return (
    <WalletButtonBtn
      title="Account"
      onClick={connecting ? resetWallet : toggleWallet}
      active={accountItem === AccountItems.Wallet}
    >
      {connected ? (
        <>
          {WalletIcon ? (
            <Idle>
              <WalletIcon />
            </Idle>
          ) : null}
          <TruncatedAddress>{truncatedAddress}</TruncatedAddress>
        </>
      ) : (
        <span>
          {accountItem === AccountItems.Wallet && connecting
            ? 'Back'
            : 'Connect'}
        </span>
      )}
      <PendingTxContainer pending={pending} error={error} success={success}>
        <ActivitySpinner pending={pending} error={error} success={success} />
        <div>
          {success
            ? '✓'
            : error
            ? '✗'
            : pendingCount === 0
            ? null
            : pendingCount}
        </div>
      </PendingTxContainer>
    </WalletButtonBtn>
  );
};

export const AppBar: FC<{}> = () => {
  const accountOpen = useAccountOpen();
  const closeAccount = useCloseAccount();

  return (
    <Container inverted={accountOpen}>
      <Inner>
        <Top>
          <Logo inverted={accountOpen}>
            <Link to="/" title="Home" onClick={closeAccount}>
              <LogoSvg />
            </Link>
          </Logo>
          <Buttons>
            <NotificationsButton />
            <WalletButton />
          </Buttons>
        </Top>
      </Inner>
      <StatusWarningsRow />
    </Container>
  );
};
