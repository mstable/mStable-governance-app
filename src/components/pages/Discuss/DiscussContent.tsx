import React, { FC } from 'react';
import styled from 'styled-components';
import { FormRow } from '../../core/Form';
import { H3, P } from '../../core/Typography';
import { ViewportWidth } from '../../../theme';
import mip from './MIPs.png'
import forum from './forum.png'
import twitter from './twitter.png'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    flex-direction: row;
    > :first-child {
      margin-right: 48px;
    }
  }
`;

const IFrameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    border-bottom: none;
  }
  img {
    width: 350px;
    height: 250px;
  }

  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    img {
    width: 500px;
    height: 350px;
  }
  }
`;


export const DiscussContent: FC<{}> = () => {
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
          <a href='https://forum.mstable.org/'>
            <H3>Forum</H3>
          </a>
          <P>Join our Forum to indicate rough consensus for ideas and contribute your ideas</P>
          <ImageContainer>
            <a href='https://forum.mstable.org/'>
              <img src={forum} alt="forum" width="500" height="350" />
            </a>
          </ImageContainer>
        </FormRow>
      </Container>
      <Container>
        <FormRow>
          <a href='https://mips.mstable.org/all-mip'>
            <H3>MIPs</H3>
            <P>Explore implemented and upcoming proposals</P>
          </a>
          <ImageContainer>
            <a href='https://mips.mstable.org/all-mip'>
              <img src={mip} alt="MIPs" width="500" height="350" />
            </a>
          </ImageContainer>
        </FormRow>
        <FormRow>
          <a href='https://twitter.com/mstable_'>
            <H3>Twitter</H3>
          </a>
          <P>Follow all the latest news regarding mStable protocol</P>
          <ImageContainer>
            <a href='https://twitter.com/mstable_'>
              <img src={twitter} alt="twitter" width="500" height="350" />
            </a>

          </ImageContainer>
        </FormRow>
      </Container>
    </>
  );
};
