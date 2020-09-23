import React, { FC } from 'react';
import styled from 'styled-components';
import { A } from 'hookrouter';

import { useToggleWallet } from '../../../context/AppProvider';
import { useIncentivisedVotingLockup } from '../../../context/DataProvider/DataProvider';
import { useMetaToken } from '../../../context/DataProvider/TokensProvider';
import { Button } from '../../core/Button';
import { useAccount } from '../../../context/UserProvider';
import { H2 } from '../../core/Typography';
import { EtherscanLink } from '../../core/EtherscanLink';
import { ReactComponent as LinkIcon } from '../../icons/wizard/link.svg';
import { ReactComponent as GetIcon } from '../../icons/wizard/get.svg';
import { ReactComponent as StakeIcon } from '../../icons/wizard/stake.svg';
import { ReactComponent as VoteIcon } from '../../icons/wizard/vote.svg';
import { ReactComponent as BalancerIcon } from '../../icons/wizard/balancer.svg';
import { ReactComponent as UniswapIcon } from '../../icons/wizard/uniswap.svg';

// TODO highlight the active step, rather than subduing the non-active ones
const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  opacity: ${({ active, completed }) => (completed || active ? 1 : 0.4)};
  pointer-events: ${({ active, completed }) => !active && !completed && 'none'};
  h2 {
    color: ${({ completed, theme }) => completed && theme.color.green};
  }
  padding-bottom: 16px;
`;

const Container = styled.div``;

const ExchangesContainer = styled.div`
  display: flex;
  flex-direction: column;
  a {
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    width: max-content;
    svg {
      width: 20px;
      height: auto;
    }
  }
`;

const IconsContainer = styled.div<{ completed?: boolean }>`
  display: flex;
  padding-bottom: 8px;
  svg {
    width: 20px;
    height: auto;
    fill: ${({ completed }) => (completed ? 'green' : 'black')};
    padding-bottom: 10px;
  }
  h2 {
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
      <Step completed={account !== null} active={!account}>
        <IconsContainer completed={account !== null}>
          <H2>1. Connect account</H2>
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
      <Step
        completed={hasMetaBalance}
        active={!hasMetaBalance && !hasStakingBalance && account !== null}
      >
        <IconsContainer completed={hasMetaBalance}>
          <H2>2. Get MTA</H2>
          <GetIcon />
        </IconsContainer>
        <ExchangesContainer>
          <a href="https://balancer.exchange/#/swap">
            Balancer <BalancerIcon />
          </a>
          <br />
          <a href="https://app.uniswap.org/#/swap">
            Uniswap <UniswapIcon />
          </a>
        </ExchangesContainer>
      </Step>
      <Step
        completed={hasStakingBalance}
        active={hasMetaBalance && !hasStakingBalance}
      >
        <IconsContainer completed={hasStakingBalance}>
          <H2>3. Stake your MTA</H2>
          <StakeIcon />
        </IconsContainer>
        <A href="/stake">Stake MTA</A>
      </Step>
      <Step active={hasStakingBalance}>
        <IconsContainer>
          <H2>4. Vote with your MTA</H2>
          <VoteIcon />
        </IconsContainer>
        <A href="/vote">Vote</A>
      </Step>
    </Container>
  );
};
