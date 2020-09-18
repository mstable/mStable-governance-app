import React, { FC, useEffect } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as StakeIcon } from '../../icons/circle/lock.svg';
import { TransactionForm } from '../../forms/TransactionForm';
import { StakeInput } from './StakeInput';
import { StakeProvider, useStakeState } from './StakeProvider';
import { FormProvider, useSetFormManifest } from '../../forms/TransactionForm/FormProvider';
import { Interfaces } from '../../../types';
import { BigDecimal } from '../../../web3/BigDecimal';
import { useSignerContext } from '../../../context/SignerProvider';
import { IIncentivisedVotingLockupFactory } from '../../../typechain/IIncentivisedVotingLockupFactory';
import { IIncentivisedVotingLockup } from '../../../typechain/IIncentivisedVotingLockup.d';

const StakeForm: FC<{}> = () => {
  const { valid, amount, transactionType, data, unlockTime } = useStakeState();
  const address = data.incentivisedVotingLockup?.address;
  const signer = useSignerContext();
  const iface = address && signer ? IIncentivisedVotingLockupFactory.connect(address, signer) : undefined

  const setFormManifest = useSetFormManifest();

  useEffect(() => {
    if (valid) {
      setFormManifest<Interfaces.IncentivisedVotingLockup, 'createLock'>({
        fn: 'createLock',
        args: [(amount as BigDecimal).exact, unlockTime as number],
        iface: (iface as IIncentivisedVotingLockup)
      })
    }
  }, [amount, transactionType, unlockTime, address, valid, setFormManifest, iface])

  return (
    <div>
      <PageHeader
        icon={<StakeIcon />}
        title="STAKE"
        subtitle="Stake your MTA to participate in mStable protocol governance"
      />
      <TransactionForm
        confirmLabel='Confirm Deposit and Lockup'
        input={<StakeInput />}
        valid={valid}
      />
    </div>
  );
};

export const Stake: FC<{}> = () => {
  return (

    <StakeProvider>
      <FormProvider formId="stake">
        <StakeForm />
      </FormProvider>
    </StakeProvider>
  )
};



