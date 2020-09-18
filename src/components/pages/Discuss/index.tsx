import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as DiscussIcon } from '../../icons/circle/discuss.svg';
import { DiscussContent } from './DiscussContent';

export const Discuss: FC<{}> = () => {
  return (
    <div>
      <PageHeader
        icon={<DiscussIcon />}
        title="Discuss"
        subtitle="Join the discussion and be part of the process"
      />
      <DiscussContent />
    </div>
  )
};
