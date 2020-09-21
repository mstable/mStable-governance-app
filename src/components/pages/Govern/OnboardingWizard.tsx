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
import { ReactComponent as LinkIcon } from '../../icons/wizard/link.svg';
import { ReactComponent as GetIcon } from '../../icons/wizard/get.svg';
import { ReactComponent as StakeIcon } from '../../icons/wizard/stake.svg';
import { ReactComponent as VoteIcon } from '../../icons/wizard/vote.svg';

interface Props {
  current: number;
}

// TODO highlight the active step, rather than subduing the non-active ones
const Step = styled.div<{ active?: boolean, completed?: boolean, number?: number }>`
  opacity: ${({ active, completed }) => ((!completed && active) ? 1 : 0.4)};
  H4 {
    color: ${({ completed }) => (completed && 'green')};
  }
  padding-bottom: 16px;
`;

const Container = styled.div``;

const ExchangesContainer = styled.div`
display: flex;
flex-direction: column;
  A {
    border-bottom: none;
    padding-bottom: 5px;
  }
`;

const IconsContainer = styled.div<{ completed?: boolean }>`
  display: flex;
  svg {
    width: 20px;
    height: auto;
    fill: ${({ completed }) => (completed ? 'green' : 'black')};
  }
  H4 {
    padding-right: 10px;
  }
`;

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
      <Step number={1} completed={account !== null} active={!account} >
        <IconsContainer completed={account !== null}>
          <H4>1. Connect account</H4>
          <LinkIcon />
        </IconsContainer>
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
      <Step number={2} completed={hasMetaBalance} active={!hasMetaBalance && !hasStakingBalance}>
        <IconsContainer completed={hasMetaBalance}>
          <H4>2. Get MTA</H4>
          <GetIcon />
        </IconsContainer>
        <ExchangesContainer>
          <a href='https://balancer.exchange/#/swap'>Balancer</a>
          <a href='https://app.uniswap.org/#/swap'>Uniswap</a>
        </ExchangesContainer>
      </Step>
      <Step number={3} completed={hasStakingBalance} active={hasMetaBalance && !hasStakingBalance}>
        <IconsContainer completed={hasStakingBalance}>
          <H4>3. Stake your MTA</H4>
          <StakeIcon />
        </IconsContainer>
        <A href="/stake">Stake MTA</A>
      </Step>
      <Step number={4} active={hasStakingBalance}>
        <IconsContainer completed={hasStakingBalance}>
          <H4>4. Vote with your MTA</H4>
          <VoteIcon />
        </IconsContainer>
        <A href="/vote">Vote</A>
      </Step>
    </Container>
  );
};
