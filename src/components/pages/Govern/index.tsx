import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as GovernanceIcon } from '../../icons/circle/gavel.svg';
import { GovernContent } from './GovernContent';

export const Govern: FC<{}> = () => {
  return (
    <div>
      <PageHeader
        icon={<GovernanceIcon />}
        title="GOVERN"
        subtitle="Learn how mStable Protocol Governance works and participate"
      />
      <GovernContent />
    </div>
  );
};
