import React, { FC } from 'react';

import styled from 'styled-components';
import { H2, P } from '../../core/Typography';
import { OnboardingWizard } from './OnboardingWizard';
import { ExternalLink } from '../../core/ExternalLink';
import flow from './flow.png';
import { Color } from '../../../theme';

const Image = styled.img`
  padding-top: 40px;
  max-width: 100%;
  height: auto;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;

  p {
    max-width: 500px;
  }

  h2 {
    text-align: center;
  }

  > div {
    padding: 16px;
    border: 1px ${Color.blackTransparent} solid;
    border-radius: 4px;
  }
`;

const OnboardingContent = styled(Content)``;

const Container = styled.div``;

export const GovernContent: FC = () => {
  return (
    <Container>
      <Content>
        <div>
          <H2>About mStable Governance</H2>
          <P>
            mStable is governed by MTA holders who have staked their tokens to
            participate in our community-based proposal system.
          </P>
          <P>
            mStable's governance goes through a process where consensus is
            reached in progressively concrete stages. Proposals and ideas are
            surfaced on the discord or our public forum, and are finalised by on
            chain signalling by MTA holders. The progression of increasingly
            binding consensus can be seen below.
          </P>
          <P>
            <ExternalLink href="https://docs.mstable.org/mstable-assets/functions/governance">
              Learn more
            </ExternalLink>
          </P>
        </div>
      </Content>
      <Image src={flow} alt="mStable governance process" />
      <OnboardingContent>
        <div>
          <H2>Get Started</H2>
          <OnboardingWizard />
        </div>
      </OnboardingContent>
    </Container>
  );
};
