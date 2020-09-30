import React, { FC } from 'react';
import styled from 'styled-components';

import { TabsContainer, TabBtn } from '../../core/Tabs';
import { Color } from '../../../theme';
import { TransactionType } from './types';
import { useStakeState, useStakeDispatch } from './StakeProvider';
import { CreateLock } from './createLock/CreateLock';
import { Claim } from './claim/Claim';
import { Exit } from './exit/Exit';
import { IncreaseLock } from './increaseLock/IncreaseLock';

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
  const { transactionType, data: { incentivisedVotingLockup } } = useStakeState();
  const { setTransactionType } = useStakeDispatch();
  if (incentivisedVotingLockup?.userStakingBalance && incentivisedVotingLockup.userStakingBalance?.simple >= 0 && transactionType === TransactionType.CreateLock) {
    setTransactionType(TransactionType.IncreaseLockAmount)
  }
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
        {

          transactionType === TransactionType.CreateLock ? <TabButton tab={TransactionType.CreateLock} /> : (transactionType === TransactionType.IncreaseLockAmount ? <TabButton tab={TransactionType.IncreaseLockAmount} /> : <TabButton tab={TransactionType.IncreaseLockTime} />)
        }
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
        ) : transactionType === TransactionType.IncreaseLockAmount || transactionType === TransactionType.IncreaseLockTime ? (
          <IncreaseLock />
        ) : (
                  <div>TODO</div>
                )}
      </div>
    </Container>
  );
};
