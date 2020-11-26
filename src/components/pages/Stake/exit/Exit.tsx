import React, { FC, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { format, startOfDay, toDate } from 'date-fns/esm';
import { addDays } from 'date-fns';
import { Interfaces } from '../../../../types';
import { TransactionForm } from '../../../forms/TransactionForm';
import {
  FormProvider,
  useSetFormManifest,
} from '../../../forms/TransactionForm/FormProvider';
import { Protip } from '../../../core/Protip';
import { useStakeState, useStakeContract } from '../StakeProvider';
import { ExitInput } from './ExitInput';
import { ExitConfirm } from './ExitConfirm';

const StyledTransactionForm = styled(TransactionForm)`
  h3 {
    border-top: 0;
  }
`;

const ExitForm: FC = () => {
  const {
    data: { incentivisedVotingLockup },
  } = useStakeState();
  const setFormManifest = useSetFormManifest();
  const contract = useStakeContract();
  const canUnlock =
    Date.now() >=
    (incentivisedVotingLockup?.userLockup?.lockTime as number) * 1000;
  const balance = incentivisedVotingLockup?.userStakingBalance;

  useEffect(() => {
    if (canUnlock && contract) {
      return setFormManifest<Interfaces.IncentivisedVotingLockup, 'withdraw'>({
        fn: 'withdraw',
        args: [],
        contract,
      });
    }
    return setFormManifest(null);
  }, [setFormManifest, canUnlock, contract]);

  return incentivisedVotingLockup ? (
    !balance || balance.simple === 0 || canUnlock ? (
      <StyledTransactionForm
        confirmLabel="Withdraw"
        confirm={<ExitConfirm />}
        input={<ExitInput />}
        transactionsLabel="Transactions"
        valid={canUnlock}
      />
    ) : (
      <>
        <Protip emoji="🔒" title="Your stake is currently locked!">
          Your stake of {incentivisedVotingLockup.userLockup?.value.simple} MTA
          will unlock on{' '}
          {incentivisedVotingLockup.userLockup?.lockTime
            ? format(
                startOfDay(
                  addDays(
                    toDate(
                      (incentivisedVotingLockup?.userLockup
                        ?.lockTime as number) * 1000,
                    ),
                    1,
                  ),
                ),
                'dd-MM-yyyy',
              )
            : null}
          .
        </Protip>
        <br />
      </>
    )
  ) : (
    <Skeleton />
  );
};

export const Exit: FC = () => (
  <FormProvider formId="exit">
    <ExitForm />
  </FormProvider>
);
