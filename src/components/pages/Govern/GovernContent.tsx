import React, { FC } from 'react';

import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { OnboardingWizard } from './OnboardingWizard';

export const GovernContent: FC<{}> = () => {
  return (
    <>
      <FormRow>
        <H3>mStable Governance</H3>
        <div>TODO create this content</div>
      </FormRow>
      <FormRow>
        <H3>Get Started</H3>
        <OnboardingWizard />
      </FormRow>
    </>
  );
};
