import React, { FC } from 'react';

import { FormRow } from '../../core/Form';
import { H3, P } from '../../core/Typography';
import { OnboardingWizard } from './OnboardingWizard';
import { ExternalLink } from '../../core/ExternalLink';

export const GovernContent: FC<{}> = () => {
  return (
    <>
      <FormRow>
        <H3>mStable Governance</H3>
        <P>mStable is governed by MTA holders who have staked their tokens to participate in our community-based proposal system.</P>
        <P>Stake your MTA and come have your say on how mStable is governed.</P>
        <P>For more info, <ExternalLink href="https://docs.mstable.org/mstable-assets/functions/governance">click here</ExternalLink>.</P>
      </FormRow>
      <FormRow>
        <H3>Get Started</H3>
        <OnboardingWizard />
      </FormRow>
    </>
  );
};
