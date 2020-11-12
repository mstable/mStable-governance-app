import React, { FC } from 'react';
import styled from 'styled-components';

import { GovernHeader } from './GovernHeader';
import { GovernFeed } from './GovernFeed';

const Wrapper = styled.div`
  display: grid;
  overflow-x: hidden;
  min-height: 100vh;
  grid-template-columns: 1fr min(1200px, 100%) 1fr;
`;

export const Govern: FC<{}> = () => {
  return (
    <Wrapper>
      <GovernHeader />
      <GovernFeed />
    </Wrapper>
  );
};
