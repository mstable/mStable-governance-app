import React, { FC } from 'react';
import styled from 'styled-components';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';
import { ViewportWidth } from '../../../theme';

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

export const DiscussContent: FC<{}> = () => {
  return (
    <>
      <Container>
        <FormRow>
          <H3>Discord</H3>
          <IFrameContainer>
            <iframe
              title="Discord widget"
              src="https://discordapp.com/widget?id=525087739801239552&theme=dark"
              width="350"
              height="350"
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
          </IFrameContainer>
        </FormRow>
        <FormRow>
          <H3>Forum</H3>
        </FormRow>
      </Container>
      <Container>
        <FormRow>
          <H3>MIPs</H3>
        </FormRow>
        <FormRow>
          <H3>Twitter</H3>
        </FormRow>
      </Container>
    </>
  );
};
