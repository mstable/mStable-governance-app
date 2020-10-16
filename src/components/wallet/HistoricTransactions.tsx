import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { useOrderedCurrentTransactions } from '../../context/TransactionsProvider';
import { Transaction, TransactionStatus } from '../../types';
import { getTransactionStatus } from '../../utils/transactions';
import { EMOJIS } from '../../utils/constants';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { P } from '../core/Typography';
import { CountUp } from '../core/CountUp';
import { useHistoricTransactionsQuery } from '../../graphql/mstable';
import { transformRawData } from './transformRawData';
import { HistoricTransactionsData, HistoricTransaction } from './types';
import { BigDecimal } from '../../utils/BigDecimal';
import { formatUnix } from '../../utils/time';

const TxContainer = styled.div<{}>`
  display: flex;
  > * {
    margin-right: 8px;
  }
`;

const TxStatusContainer = styled.div`
  height: 16px;
  width: 16px;
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
    case 'CREATE_LOCK': {
      return (
        <>
          {' '}
          You created a lock of{' '}
          <Balance end={new BigDecimal(tx.value as string).simple} /> MTA until{' '}
          <LockTime>{formatUnix(parseInt(tx.lockTime as string, 10))}</LockTime>{' '}
        </>
      );
    }
    case 'INCREASE_LOCK_AMOUNT': {
      return (
        <>
          {' '}
          You increased an amount of the lock for additional{' '}
          <Balance end={new BigDecimal(tx.value as string).simple} /> MTA{' '}
        </>
      );
    }
    case 'INCREASE_LOCK_TIME': {
      return (
        <>
          {' '}
          You increased lock period until{' '}
          <LockTime>
            {formatUnix(parseInt(tx.lockTime as string, 10))}
          </LockTime>{' '}
        </>
      );
    }
    case 'WITHDRAW': {
      return (
        <>
          {' '}
          You withdrew
          <Balance end={new BigDecimal(tx.value as string).simple} /> MTA{' '}
        </>
      );
    }
    case 'CLAIM': {
      return (
        <>
          {' '}
          // TODO
          {/* <Balance end={new BigDecimal(tx.reward as string).simple} /> MTA{' '} */}
        </>
      );
    }
    default:
      return <> Unsupported transaction </>;
  }
};

const TxStatusIndicator: FC<{}> = () => {
  return (
    <TxStatusContainer title="Completed">
      <span>{EMOJIS.approve}</span>
    </TxStatusContainer>
  );
};

const Tx: FC<{
  tx: HistoricTransaction;
}> = ({ tx }) => {
  const description = useMemo(() => getTxDescription(tx), [tx]);
  return (
    <TxContainer>
      <TxStatusIndicator />
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
    fetchPolicy: 'cache-first',
  });
  const historicTxsData = historicTxsQuery.data;
  const transformedData = transformRawData(historicTxsData);
  return (
    <div>
      {transformedData.length === 0 ? (
        <P size={2}>No transactions sent in the current session.</P>
      ) : (
        <List>
          {transformedData.map((tx: HistoricTransaction) => (
            <ListItem key={tx.hash}>
              <Tx tx={tx} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
