import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { useOrderedCurrentTransactions } from '../../context/TransactionsProvider';
import { Transaction, TransactionStatus } from '../../types';
import { getTransactionStatus } from '../../web3/transactions';
import { EMOJIS } from '../../web3/constants';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { P } from '../core/Typography';
import { State } from '../pages/Stake/types';
import { useStakeState } from '../pages/Stake/StakeProvider';

const PendingTxContainer = styled.div<{ inverted?: boolean }>`
  display: flex;
  > * {
    margin-right: 8px;
  }

  a {
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.white : theme.color.black};
    border-bottom: none;

    span {
      border-bottom: 1px
        ${({ theme, inverted }) =>
          inverted ? theme.color.white : theme.color.black}
        solid;
    }
  }
`;

const TxStatusContainer = styled.div`
  height: 16px;
  width: 16px;
`;

const getStatusLabel = (status: TransactionStatus): string =>
  status === TransactionStatus.Success
    ? 'Confirmed'
    : status === TransactionStatus.Error
    ? 'Error'
    : 'Pending';

const getPendingTxDescription = (
  tx: Transaction,
  stakingData?: State,
): JSX.Element => {
  switch (tx.fn) {
    case 'claimReward': {
      return <> You {tx.status ? 'claimed' : 'are claiming'} MTA reward</>;
    }
    case 'createLock': {
      return (
        <>
          {' '}
          You {tx.status ? 'staked' : 'are staking'}{' '}
          {stakingData?.lockupAmount.amount} MTA for{' '}
          {stakingData
            ? (stakingData.lockupPeriod.formValue / 7).toFixed(1)
            : null}{' '}
          weeks{' '}
        </>
      );
    }
    case 'withdraw': {
      return (
        <> You {tx.status ? 'exited' : 'are exiting'} the staking contract </>
      );
    }
    default:
      return <> Unsupported transaction </>;
  }
};

const TxStatusIndicator: FC<{ tx: Transaction }> = ({ tx }) => {
  const status = getTransactionStatus(tx);
  const label = getStatusLabel(status);
  return (
    <TxStatusContainer title={label}>
      {status === TransactionStatus.Pending ? (
        <ActivitySpinner pending />
      ) : status === TransactionStatus.Error ? (
        <span>{EMOJIS.error}</span>
      ) : (
        <span>{EMOJIS[tx.fn as keyof typeof EMOJIS]}</span>
      )}
    </TxStatusContainer>
  );
};

const PendingTx: FC<{
  tx: Transaction;
  inverted: boolean;
}> = ({ tx, inverted }) => {
  const stakingData = useStakeState();

  const description = useMemo(() => getPendingTxDescription(tx, stakingData), [
    tx,
    stakingData,
  ]);

  return (
    <PendingTxContainer inverted={inverted}>
      <TxStatusIndicator tx={tx} />
      <EtherscanLink data={tx.hash} type="transaction">
        {tx.status === 0 ? 'Error: ' : ''}
        {description}
      </EtherscanLink>
    </PendingTxContainer>
  );
};

/**
 * List of recently-sent transactions.
 */
export const Transactions: FC<{ formId?: string }> = ({ formId }) => {
  const pending = useOrderedCurrentTransactions(formId);

  return (
    <div>
      {pending.length === 0 ? (
        <P size={2}>No transactions sent in the current session.</P>
      ) : (
        <List>
          {pending.map(tx => (
            <ListItem key={tx.hash}>
              <PendingTx tx={tx} inverted={!formId} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
