import React, { FC } from 'react';
import { PageHeader } from '../PageHeader';
import { ReactComponent as VoteIcon } from '../../icons/circle/vote.svg';
import { VoteContent } from './VoteContent';

export const Vote: FC<{}> = () => {
    return (
        <div>
            <PageHeader
                icon={<VoteIcon />}
                title="Vote"
                subtitle="Vote on the future of the mStable protocol"
            />
            <VoteContent />
        </div>
    );
};
