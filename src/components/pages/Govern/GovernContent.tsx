import React, { FC } from 'react';

import styled from 'styled-components';
import { FormRow } from '../../core/Form';
import { H3, P } from '../../core/Typography';
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
    width: auto;
    height: auto;
    max-width: 350px;
    max-height: 350px;
    border-radius: 6px;
    margin: auto;
  }

  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      width: auto;
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
        <H3>mStable Governance</H3>
        <P>mStable is governed by MTA holders who have staked their tokens to participate in our community-based proposal system.</P>
        <P>Stake your MTA and come have your say on how mStable is governed.</P>
        <P>For more info, <ExternalLink href="https://docs.mstable.org/mstable-assets/functions/governance">click here</ExternalLink>.</P>
        <ImageContainer>
          <img src={flow} alt="twitter" />
        </ImageContainer>
      </FormRow>
      <FormRow>
        <H3>Get Started</H3>
        <OnboardingWizard />
      </FormRow>
    </>
  );
};
