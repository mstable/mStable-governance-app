import React, { FC, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useMetaToken } from '../../../context/DataProvider/TokensProvider';
import { ViewportWidth } from '../../../theme';
import { CountUp } from '../../core/CountUp';
import { useStakeDispatch, useStakeState } from '../Stake/StakeProvider';
import { useIncentivisedVotingLockupAtBlock } from '../Stats/IncentivisedVotingLockupAtBlockProvider';
import { useStatsData } from '../Stats/StatsDataProvider';

const Container = styled.div`
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 1.5rem;
  border-radius: 1rem;
  justify-self: flex-end;
  display: flex;
  flex-direction: column;

  @media (min-width: ${ViewportWidth.l}) {
    flex-basis: calc(45% - 0.5rem);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.5rem;
    line-height: 1em;
    font-weight: 600;
    margin-right: 1rem;
  }

  p {
    font-size: 0.875rem;
    color: #808080;

    > span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    a > span {
      display: inline;
    }
  }
`;

const Items = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
`;

const StyledRow = styled.button`
  display: flex;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  background: #f7f8f9;
  border-radius: 1.25rem;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;

  &:focus,
  :active {
    outline: none;
    box-shadow: 0 0 2px inset ${({ theme }) => theme.color.blue};
  }

  &:hover {
    background: #ececec;
  }
`;

const Circle = styled.div<{ color: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  margin-right: 0.5rem;
  background: ${({ color }) => color};
`;

const Row: FC<{ title: string; color: string }> = ({ title, color }) => {
  return (
    <StyledRow>
      <Circle color={color} />
      {title}
    </StyledRow>
  );
};

export const GovernDAO: FC = () => {
  const isNavigating = true;

  return (
    <Container>
      <Header>
        <h3>DAOs</h3>
        <p>
          ~ $<span>120,000,230</span>
        </p>
      </Header>
      <Items>
        <Row title="mStable" color="#000" />
        <Row title="Community" color="#4C4FA8" />
        <Row title="Protocol" color="#CC1010" />
      </Items>
    </Container>
  );
};
