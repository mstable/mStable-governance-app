import React, { FC, useLayoutEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import { ReactTooltip, Tooltip } from '../core/ReactTooltip';
import { Header } from './Header';
import { Footer } from './Footer';
import { Account } from './Account';
import { useAccountOpen } from '../../context/AppProvider';
import { useIsIdle } from '../../context/UserProvider';
import { Background } from './Background';
import { AppBar } from './AppBar';
import { NotificationToasts } from './NotificationToasts';
import { centredLayout } from './css';
import { Color, ViewportWidth } from '../../theme';

const Main = styled.main`
  width: 100%;
  flex: 1;
  padding: 20px;
`;

const GlobalStyle = createGlobalStyle<{ idle: boolean }>`
  ${reset}
  a {
    color: ${({ theme }) => theme.color.offBlack};
    text-decoration: none;
    border-bottom: 1px ${({ theme }) => theme.color.offBlack} solid;
  }
  html {
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  body {
    min-width: 320px;
    ${({ idle }) =>
      idle
        ? 'transition: filter 5s ease; filter: grayscale(50%) brightness(50%)'
        : ''};
  }
  code {
    display: block;
    padding: 16px;
    border-radius: 2px;
    border: 1px ${Color.blackTransparent} solid;
    background: ${Color.white};
    ${({ theme }) => theme.mixins.numeric}
  }
  * {
      box-sizing: border-box;
  }
  body, button, input {
    font-family: 'Poppins', sans-serif;
    color: ${Color.offBlack};
    line-height: 1.3rem;
  }
  // Onboard.js
  aside.bn-onboard-custom {
     z-index: 5 !important;
     width: 100% !important;
     height: 100% !important;
     
    .bn-onboard-modal-content {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
      width: inherit;
      max-width: inherit;
      box-sizing: border-box;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      transition: all ease-in;
    }
    .bn-onboard-modal-content-header {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.offBlack};
      justify-content: center;
    }
    h3 {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.offBlack};
      font-weight: 600;
      font-size: 1.125rem;
    }
    .bn-onboard-modal-content-header-icon,
    .bn-onboard-select-description {
      display: none;
    }
    .bn-onboard-icon-button {
      font-weight: normal;
      padding: 0.5rem 1rem;
      width: 100%;
      border: 1px ${Color.blackTransparent} solid;
      border-radius: 0.5rem;
      > :first-child {
        min-width: 32px;
      }
      > span {
        font-weight: 500;
        font-size: 1rem;
        color: ${({ theme }) => theme.color.offBlack};
      }
      &:hover {
        border: 1px solid ${({ theme }) => theme.color.offBlack};
        box-shadow: none;
      }
    }
    .bn-onboard-modal-content-close {
      top: 1.5rem;
    }
    .bn-onboard-modal-select-wallets li {
      width: 50%;
    }
    .bn-onboard-modal-select-wallets {
      .bn-onboard-prepare-button { 
        color: 1px solid ${({ theme }) => theme.color.offBlack} !important;
        border: 1px ${Color.blackTransparent} solid !important;
      }
    }
    .bn-onboard-select-info-container  {
      justify-content: center !important;
      
      .bn-onboard-prepare-button { 
        display: none;
      }
      
      span {
        text-align: center;
        color: ${({ theme }) => theme.color.offBlack};
        font-size: 0.875rem !important;
        margin: 0 !important;
      }
    }
    .bn-onboard-modal-selected-wallet {
      > *:not(:last-child) {
        margin-bottom: 0.75rem;
      }
    }
    
    
    @media (min-width: ${ViewportWidth.s}) {
      .bn-onboard-modal-content {
        position: relative;
        max-width: 28rem;
        border-radius: 1rem;
      }
    }
  }
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const HeaderGroup: FC<{}> = () => (
  <StickyHeader>
    <AppBar />
    <Header />
  </StickyHeader>
);

const Centred = styled.div`
  flex: 1;
  ${centredLayout}
`;

const Container = styled.div<{ accountOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  min-height: calc(100vh - 180px);

  background: ${({ accountOpen }) =>
    accountOpen ? Color.black : 'transparent'};
`;

const PageContainer = styled.div<{ accountOpen: boolean }>`
  > :first-child {
    display: ${({ accountOpen }) => (accountOpen ? 'none' : 'flex')};
  }
  > :last-child {
    display: ${({ accountOpen }) => (accountOpen ? 'flex' : 'none')};
  }
`;

export const Layout: FC<{}> = ({ children }) => {
  const accountOpen = useAccountOpen();
  const idle = useIsIdle();

  useLayoutEffect(() => {
    // Scroll to the top when the account view is toggled
    window.scrollTo({ top: 0 });
  }, [accountOpen]);

  return (
    <>
      <Background accountOpen={accountOpen} />
      <HeaderGroup />
      <PageContainer accountOpen={accountOpen}>
        <Container>
          <Centred>
            <Main>{children}</Main>
          </Centred>
        </Container>
        <Container accountOpen>
          <Account />
        </Container>
      </PageContainer>
      <Footer accountOpen={accountOpen} />
      <Tooltip tip="" hideIcon />
      <ReactTooltip id="global" place="top" />
      <NotificationToasts />
      <GlobalStyle idle={idle} />
    </>
  );
};
