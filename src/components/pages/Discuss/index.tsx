import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as GovernanceIcon } from '../../icons/circle/analytics.svg';
import { DiscussContent } from './DiscussContent';

export const Discuss: FC<{}> = () => {
  return (
    <div>
      <PageHeader
        icon={<GovernanceIcon />}
        title="Discuss"
        subtitle="Join the discussion and be part of the process"
      />
      <DiscussContent />
    </div>
  )
};
