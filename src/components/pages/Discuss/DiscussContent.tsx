import React, { FC } from 'react';
import styled from 'styled-components';
import { FormRow } from '../../core/Form';
import { H3, P } from '../../core/Typography';
import { ViewportWidth } from '../../../theme';
import mip from './MIPs.png';
import forum from './forum.png';
import twitter from './twitter.png';

const Container = styled.div`
  @media (min-width: ${ViewportWidth.s}) {
    display: flex;
    > :first-child {
      margin-right: 48px;
    }
  }
`;

const IFrameContainer = styled.div`
  padding-top: 40px;

  iframe {
    max-width: 100%;
  }

  @media (min-width: ${ViewportWidth.s}) {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const Image = styled.div`
  padding-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    border-bottom: none;
  }

  img {
    border-radius: 6px;
    max-width: 100%;
    height: auto;
  }

  @media (min-width: ${ViewportWidth.s}) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;

export const DiscussContent: FC = () => {
  return (
    <>
      <Container>
        <FormRow>
          <H3>Discord</H3>
          <P>Join our Discord to become part of the community</P>
          <IFrameContainer>
            <iframe
              title="Discord widget"
              src="https://discordapp.com/widget?id=525087739801239552&theme=dark"
              width="500"
              height="350"
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
          </IFrameContainer>
        </FormRow>
        <FormRow>
          <a href="https://forum.mstable.org/">
            <H3>Forum</H3>
          </a>
          <P>
            Join our forum to indicate rough consensus for ideas and contribute
            your ideas
          </P>
          <Image>
            <a href="https://forum.mstable.org/">
              <img src={forum} alt="forum" />
            </a>
          </Image>
        </FormRow>
      </Container>
      <Container>
        <FormRow>
          <a href="https://mips.mstable.org/all-mip">
            <H3>MIPs</H3>
            <P>Explore implemented and upcoming proposals</P>
          </a>
          <Image>
            <a href="https://mips.mstable.org/all-mip">
              <img src={mip} alt="MIPs" />
            </a>
          </Image>
        </FormRow>
        <FormRow>
          <a href="https://twitter.com/mstable_">
            <H3>Twitter</H3>
          </a>
          <P>Follow all the latest news about the mStable protocol</P>
          <Image>
            <a href="https://twitter.com/mstable_">
              <img src={twitter} alt="twitter" />
            </a>
          </Image>
        </FormRow>
      </Container>
    </>
  );
};
