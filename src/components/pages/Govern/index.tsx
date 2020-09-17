import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as GovernanceIcon } from '../../icons/circle/analytics.svg';
import { GovernContent } from './GovernContent';

export const Govern: FC<{}> = () => {
  return (
    <div>
      <PageHeader
        icon={<GovernanceIcon />}
        title="Govern"
        subtitle="Learn how mStable Protocol Governance works and participate"
      />
      <GovernContent />
    </div>
  )
};
