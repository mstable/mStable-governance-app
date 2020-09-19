import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';

import { useToggleWallet } from '../../../context/AppProvider';
import { useIncentivisedVotingLockup } from '../../../context/DataProvider/DataProvider';
import { useMetaToken } from '../../../context/DataProvider/TokensProvider';
import { Button } from '../../core/Button';
import { useAccount } from '../../../context/UserProvider';
import { H4 } from '../../core/Typography';
import { EtherscanLink } from '../../core/EtherscanLink';

// TODO highlight the active step, rather than subduing the non-active ones
const Step = styled.div<{ active?: boolean }>`
  opacity: ${({ active }) => (active ? 1 : 0.4)};
  padding-bottom: 16px;
`;

const Container = styled.div``;

// TODO improve the style of this, add images, etc
export const OnboardingWizard: FC = () => {
  const toggleWallet = useToggleWallet();
  const account = useAccount();

  const incentivisedVotingLockup = useIncentivisedVotingLockup();
  const hasStakingBalance = incentivisedVotingLockup?.userStakingBalance?.gt(0);

  const metaToken = useMetaToken();
  const hasMetaBalance = metaToken?.balance.exact.gt(0);

  // TODO maybe do this in a smarter way with a manifest of steps that
  // get activated in order as the pre-requisites are provided
  return (
    <Container>
      <Step active={!account}>
        <H4>1. Connect account</H4>
        {account ? (
          <>
            Connected as{' '}
            <EtherscanLink data={account} type="account" showData truncate />
          </>
        ) : (
          <>
            <div>Connect your wallet to get started</div>
            <Button onClick={toggleWallet}>Connect Wallet</Button>
          </>
        )}
      </Step>
      <Step active={!hasMetaBalance && !hasStakingBalance}>
        <H4>2. Get MTA</H4>
        <div>TODO partner/exchange links to get MTA</div>
      </Step>
      <Step active={hasMetaBalance && !hasStakingBalance}>
        <H4>3. Stake your MTA</H4>
        <A href="/stake">Stake MTA</A>
      </Step>
      <Step active={hasStakingBalance}>
        <H4>4. Vote with your MTA</H4>
        <A href="/vote">Vote</A>
      </Step>
    </Container>
  );
};
