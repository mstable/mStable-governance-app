import { UseTableOptions } from 'react-table';

import { UserLockupDatum } from './types';

export const COLUMNS: UseTableOptions<UserLockupDatum>['columns'] = [
  {
    Header: 'Account',
    accessor: 'account',
  },
  {
    Header: 'MTA Locked',
    accessor: 'mtaLocked',
  },
  {
    Header: 'vMTA',
    accessor: 'vMTA',
  },
  {
    id: 'votingPowerPercentage',
    Header: 'Voting Power',
    accessor: 'votingPowerPercentage',
  },
  {
    Header: 'Lock Start',
    accessor: 'lockStart',
  },
  {
    Header: 'Unlock Time',
    accessor: 'unlockTime',
  },
];
