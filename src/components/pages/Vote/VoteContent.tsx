import React, { FC } from 'react';
import { Button } from '../../core/Button';

export const VoteContent: FC<{}> = () => {
    return (
        <>
            <a href='https://vote.mstable.org/'>
                <Button> Vote </Button>
            </a>
        </>
    );
};
