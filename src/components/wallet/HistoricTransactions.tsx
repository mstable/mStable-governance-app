import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { P } from '../core/Typography';
import { CountUp } from '../core/CountUp';
import {
  useHistoricTransactionsQuery,
  TransactionType,
} from '../../graphql/mstable';
import { transformRawData } from './transformRawData';
import { HistoricTransaction } from './types';

const TxContainer = styled.div<{}>`
  display: flex;
  > * {
    margin-right: 8px;
  }
`;

const Balance = styled(CountUp)<{}>`
  font-weight: bold;
`;

const LockTime = styled.p<{}>`
  font-weight: bold;
  display: inline;
`;

const getTxDescription = (tx: HistoricTransaction): JSX.Element => {
  switch (tx.type) {
    case TransactionType.CreateLock: {
      return (
        <>
          {tx.formattedDate}: You created a lock of{' '}
          <Balance end={tx.value.simple} /> MTA until{' '}
          <LockTime>{tx.lockTime}</LockTime>{' '}
        </>
      );
    }
    case TransactionType.IncreaseLockAmount: {
      return (
        <>
          {tx.formattedDate}: You increased an amount of the lock for additional{' '}
          <Balance end={tx.value.simple} /> MTA{' '}
        </>
      );
    }
    case TransactionType.IncreaseLockTime: {
      return (
        <>
          {tx.formattedDate}: You increased lock period until{' '}
          <LockTime>{tx.lockTime}</LockTime>{' '}
        </>
      );
    }
    case TransactionType.Withdraw: {
      return (
        <>
          {tx.formattedDate}: You withdrew <Balance end={tx.value.simple} /> MTA{' '}
        </>
      );
    }
    case TransactionType.Claim: {
      return (
        <>
          {tx.formattedDate}: You claimed <Balance end={tx.reward.simple} /> MTA{' '}
        </>
      );
    }
    default:
      return <> Unsupported transaction </>;
  }
};

const Tx: FC<{
  tx: HistoricTransaction;
}> = ({ tx }) => {
  const description = getTxDescription(tx);
  return (
    <TxContainer>
      <EtherscanLink data={tx.hash as string} type="transaction">
        {description}
      </EtherscanLink>
    </TxContainer>
  );
};

export const HistoricTransactions: FC<{ account: string }> = ({ account }) => {
  const historicTxsQuery = useHistoricTransactionsQuery({
    variables: {
      account: account as string,
    },
    fetchPolicy: 'cache-and-network',
  });
  const historicTxsData = historicTxsQuery.data;
  const transformedData = useMemo(() => transformRawData(historicTxsData), [
    historicTxsData,
  ]);
  return (
    <div>
      {transformedData.length === 0 ? (
        <P size={2}>No transactions sent in the current session.</P>
      ) : (
        <List>
          {transformedData.map(tx => (
            <ListItem key={tx.hash}>
              <Tx tx={tx} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
