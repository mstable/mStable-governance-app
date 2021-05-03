import { UseTableOptions } from 'react-table';

import { UserLockupDatum } from './types';

import { formatUnix } from '../../../utils/time';

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
	Cell: ({ value }) => formatUnix(value)
  },
  {
    Header: 'Unlock Time',
    accessor: 'unlockTime',
	Cell: ({ value }) => formatUnix(value)
  },
];
