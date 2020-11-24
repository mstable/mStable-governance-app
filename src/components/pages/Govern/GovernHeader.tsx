import React, { FC } from 'react';

import styled from 'styled-components';
import { Spacing, ViewportWidth } from '../../../theme';
import { CTA } from '../../core/CTA';
import Illustration from '../../icons/graphic.svg';

const Container = styled.div`
  grid-column: 1 / 6;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  border-radius: 32px;
  background: linear-gradient(
    90deg,
    rgb(241, 250, 255) 0%,
    rgb(254, 255, 241) 100%
  );
  padding: ${Spacing.xl} ${Spacing.l};

  @media (min-width: ${ViewportWidth.xl}) {
    padding: ${Spacing.xl};
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1/6;

  @media (min-width: ${ViewportWidth.m}) {
    grid-column: 1/5;
  }

  @media (min-width: ${ViewportWidth.xl}) {
    grid-column: 1/4;
    margin-right: ${({ theme }) => theme.spacing.l};
  }
`;

export const Heading = styled.h3`
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.l};

  @media (min-width: ${ViewportWidth.s}) {
    font-size: 2.5rem;
    line-height: 2.5rem;
  }
`;

export const Text = styled.p`
  max-width: 60ch;
  line-height: 1.625em;

  b {
    font-weight: 600;
  }
`;

export const Image = styled.img`
  display: none;

  @media (min-width: ${ViewportWidth.xl}) {
    display: inherit;
    grid-column: 4/6;
    width: 100%;
    width: 95%;
    justify-self: flex-end;
  }
`;

export const GovernHeader: FC = () => {
  return (
    <Container>
      <TextContainer>
        <Heading>mStable Governance</Heading>
        <Text>
          <b>
            mStable is governed by MTA holders who have staked their tokens to
            participate in the community-based proposal system.
          </b>{' '}
          Anyone can participate in the mStable governance process by joining
          discussions in either the discord or public forum. Ideas are then
          formalised and proposed to the community for on-chain signalling by
          MTA holders.{' '}
          <CTA
            href="https://docs.mstable.org/mstable-assets/functions/governance"
            externalArrow={false}
          >
            Learn more
          </CTA>
        </Text>
      </TextContainer>
      <Image src={Illustration} alt="Governance flow diagram" />
    </Container>
  );
};
