import React, { FC } from 'react';
import styled from 'styled-components';

import { TabsContainer, TabBtn } from '../../core/Tabs';
import { Color } from '../../../theme';
import { TransactionType } from './types';
import { useStakeState, useStakeDispatch } from './StakeProvider';
import { CreateLock } from './createLock/CreateLock';
import { Claim } from './claim/Claim';
import { Exit } from './exit/Exit';

const TX_TYPES = {
  [TransactionType.CreateLock]: {
    label: 'Stake',
  },
  [TransactionType.Claim]: {
    label: 'Claim',
  },
  [TransactionType.Withdraw]: {
    label: 'Withdraw stake/exit',
  },
  [TransactionType.IncreaseLockAmount]: {
    label: 'Increase lock amount',
  },
  [TransactionType.IncreaseLockTime]: {
    label: 'Increase lockup time',
  },
};

const TabButton: FC<{ tab: TransactionType }> = ({ tab }) => {
  const { transactionType } = useStakeState();
  const { setTransactionType } = useStakeDispatch();
  return (
    <TabBtn
      type="button"
      onClick={() => {
        setTransactionType(tab);
      }}
      active={transactionType === tab}
    >
      {TX_TYPES[tab].label}
    </TabBtn>
  );
};

const Container = styled.div`
  background: ${Color.offWhite};
  border-radius: 0 0 2px 2px;
  padding: 16px 0 32px 0;
  text-align: left;
`;

export const StakeForms: FC = () => {
  const { transactionType } = useStakeState();
  return (
    <Container>
      <TabsContainer>
        <TabButton tab={TransactionType.CreateLock} />
        <TabButton tab={TransactionType.Claim} />
        <TabButton tab={TransactionType.Withdraw} />
      </TabsContainer>
      <div>
        {transactionType === TransactionType.CreateLock ? (
          <CreateLock />
        ) : transactionType === TransactionType.Claim ? (
          <Claim />
        ) : transactionType === TransactionType.Withdraw ? (
          <Exit />
        ) : (
          <div>TODO</div>
        )}
      </div>
    </Container>
  );
};
