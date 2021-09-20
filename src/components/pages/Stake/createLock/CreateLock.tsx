import React, { FC } from 'react';
// import { TransactionForm } from '../../../forms/TransactionForm';
// import {
//   // FormProvider,
//   useSetFormManifest,
// } from '../../../forms/TransactionForm/FormProvider';
// import { Interfaces } from '../../../../types';
// import { BigDecimal } from '../../../../utils/BigDecimal';
//
// import { CreateLockInput } from './CreateLockInput';
// import { useStakeContract, useStakeState } from '../StakeProvider';
// import { TransactionType } from '../types';
// import { CreateLockConfirm } from './CreateLockConfirm';
import { ExternalLink } from '../../../core/ExternalLink';
import { H3 } from '../../../core/Typography';

// const StakeForm: FC = () => {
//   const {
//     lockupAmount: { amount },
//     lockupPeriod: { unlockTime },
//     transactionType,
//     valid,
//   } = useStakeState();
//   const setFormManifest = useSetFormManifest();
//   const contract = useStakeContract();
//
//   useEffect(() => {
//     if (valid && contract) {
//       switch (transactionType) {
//         case TransactionType.CreateLock:
//           return setFormManifest<
//             Interfaces.IncentivisedVotingLockup,
//             'createLock'
//           >({
//             fn: 'createLock',
//             args: [(amount as BigDecimal).exact, unlockTime as number],
//             contract,
//           });
//
//         case TransactionType.IncreaseLockAmount:
//           return setFormManifest<
//             Interfaces.IncentivisedVotingLockup,
//             'increaseLockAmount'
//           >({
//             fn: 'increaseLockAmount',
//             args: [(amount as BigDecimal).exact],
//             contract,
//           });
//
//         case TransactionType.IncreaseLockTime:
//           return setFormManifest<
//             Interfaces.IncentivisedVotingLockup,
//             'increaseLockLength'
//           >({
//             fn: 'increaseLockLength',
//             args: [unlockTime as number],
//             contract,
//           });
//
//         default:
//           break;
//       }
//     }
//     return setFormManifest(null);
//   }, [amount, transactionType, unlockTime, valid, setFormManifest, contract]);
//
//   return (
//     <TransactionForm
//       confirmLabel="Lock up and stake MTA"
//       confirm={<CreateLockConfirm />}
//       input={<CreateLockInput />}
//       valid={valid}
//     />
//   );
// };

export const CreateLock: FC = () => {
  return (
    <div>
      <H3>Expired</H3>
      <br />
      <p>
        The staking contract is now expired, meaning that new deposits cannot be
        made.
      </p>
      <p>
        You can withdraw your stake and deposit on{' '}
        <ExternalLink href="https://staking.mstable.org">
          the new mStable Staking.
        </ExternalLink>
      </p>
    </div>
  );
};
