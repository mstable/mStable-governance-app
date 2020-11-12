import React, { FC } from 'react';
import styled from 'styled-components';

import { GovernHeader } from './GovernHeader';
import { GovernFeed } from './GovernFeed';

const Wrapper = styled.div`
  display: grid;
  overflow-x: hidden;
  grid-template-columns: repeat(3, 1fr);
`;

export const Govern: FC<{}> = () => {
  return (
    <Wrapper>
      <GovernHeader />
      <GovernFeed />
    </Wrapper>
  );
};
