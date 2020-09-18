import React, { FC } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { navigate } from 'hookrouter';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { Button } from '../../core/Button';


import {
  useIsWalletConnecting,
  useResetWallet,
  useToggleWallet,
} from '../../../context/AppProvider'
import { InjectedEthereum } from '../../../types';

const HoverText = styled.p`
	color: #D3D3D3;
	:hover {
		color: #000000	;
		cursor: pointer;
	}
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 40px;
`;

const WalletContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding-top: 70px;
`;

export const GovernContent: FC<{}> = () => {
  const toggleWallet = useToggleWallet();
  const resetWallet = useResetWallet();
  const { status } = useWallet<InjectedEthereum>();
  const connected = status === 'connected';
  const connecting = useIsWalletConnecting();


  return (
    <>
      <FormRow>
        <H3>
          mStable Governance
          </H3>
      </FormRow>
      <FormRow>
        <H3>
          TODO
          </H3>
      </FormRow >
      <FormRow>
        <H3>
          Get Started
        </H3>
        <Container>
          <div>
            <HoverText onClick={connecting ? resetWallet : toggleWallet}>Connect wallet</HoverText>
          </div>
          <div>
            <HoverText>Get MTA</HoverText>
          </div>
          <div>
            <HoverText onClick={() => navigate('/stake')}>Stake MTA</HoverText>
          </div>
          <div>
            <HoverText onClick={() => navigate('/vote')}>Vote</HoverText>
          </div>
          {/* <div>
            <HoverText>Claim rewards</HoverText>
          </div> */}
        </Container>
        {!connected &&
          <WalletContainer>
            Connect your wallet to get started
          <Button onClick={connecting ? resetWallet : toggleWallet}>
              Connect Wallet
          </Button>
          </WalletContainer>
        }
      </FormRow >
    </>
  );
};

