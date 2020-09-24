import React, { FC } from 'react';

import styled from 'styled-components';
import { FormRow } from '../../core/Form';
import { H2, P } from '../../core/Typography';
import { OnboardingWizard } from './OnboardingWizard';
import { ExternalLink } from '../../core/ExternalLink';
import { ViewportWidth } from '../../../theme';
import flow from './flow.png';

const ImageContainer = styled.div`
  padding-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    border-bottom: none;
  }
  img {
    width: 90%;
    height: auto;
    max-width: 500px;
    max-height: 350px;
    border-radius: 6px;
    margin: auto;
  }

  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      width: 90%;
      height: auto;
      max-width: 1000px;
      max-height: 500px;
    }
  }
`;

export const GovernContent: FC<{}> = () => {
  return (
    <>
      <FormRow>
        <H2>mStable Governance</H2>
        <P>
          mStable is governed by MTA holders who have staked their tokens to
          participate in our community-based proposal system.
        </P>
        <P>
          mStable's governance goes through a process where consensus is reached
          in progressively concrete stages. Proposals and ideas are surfaced on
          the discord or our public forum, and are finalised by on chain
          signalling by MTA holders. The progression of increasingly binding
          consensus can be seen below.{' '}
        </P>
        <P>
          For more info,{' '}
          <ExternalLink href="https://docs.mstable.org/mstable-assets/functions/governance">
            click here
          </ExternalLink>
          .
        </P>
        <ImageContainer>
          <img src={flow} alt="twitter" />
        </ImageContainer>
      </FormRow>
      <FormRow>
        <H2>Get Started</H2>
        <OnboardingWizard />
      </FormRow>
    </>
  );
};
