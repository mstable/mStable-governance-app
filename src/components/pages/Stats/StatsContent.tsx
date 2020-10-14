import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../../theme';
import { StatsTable } from './StatsTable';
import { Metrics } from './Metrics';
import { Chart } from './Chart';
import { BlockFilter } from './BlockFilter';

const Container = styled.div`
  @media (min-width: ${ViewportWidth.l}) {
    display: flex;

    > :first-child {
      flex: 0 0 33%;
      margin-right: 32px;
    }

    > :last-child {
      flex: 0 0 66%;
    }
  }
`;

export const StatsContent: FC = () => {
  return (
    <div>
      <Container>
        <div>
          <BlockFilter />
          <Metrics />
        </div>
        <Chart />
      </Container>
      <StatsTable />
    </div>
  );
};
