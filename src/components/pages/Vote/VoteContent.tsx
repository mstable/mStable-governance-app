import React, { FC } from 'react';
import { Button } from '../../core/Button';

export const VoteContent: FC<{}> = () => {
  return (
    <>
      <a href="https://snapshot.page/#/mstable/">
        <Button> Vote </Button>
      </a>
    </>
  );
};
