import React, { FC } from 'react';
import styled from 'styled-components';
import { FormRow } from '../../core/Form';
import { H3 } from '../../core/Typography';

const Container = styled.div`
  display: flex;
  
  > :first-child {
    margin-right: 48px;
  }`;

export const DiscussContent: FC<{}> = () => {
  return (
    <>
      <Container>
        <FormRow>
          <H3>
            Discord
          </H3>
          <iframe title='Discord widget' src="https://discordapp.com/widget?id=525087739801239552&theme=dark" width="350" height="350" frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" />
        </FormRow>
        <FormRow>
          <H3>
            Forum
          </H3>
        </FormRow >
      </Container>
      <Container>
        <FormRow>
          <H3>
            MIPs
          </H3>
        </FormRow >
        <FormRow>
          <H3>
            Twitter
          </H3>
        </FormRow >
      </Container>
    </>
  );
};

