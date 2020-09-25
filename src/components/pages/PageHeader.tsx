import React, { FC } from 'react';
import styled from 'styled-components';

import { H2, H3 } from '../core/Typography';
import { FontSize, ViewportWidth } from '../../theme';

interface Props {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

const Icon = styled.div`
  padding: 0;

  img,
  svg {
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }

  img + div {
    display: none;
  }
`;

const Content = styled.div`
  width: 100%;

  @media (min-width: ${ViewportWidth.s}) {
    display: flex;
    justify-content: space-between;
  }
`;

const Container = styled.div`
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;

  h2,
  h3 {
    max-width: 500px;
  }

  h2 {
    font-size: ${FontSize.xl};
  }
`;

export const PageHeader: FC<Props> = ({ children, title, subtitle, icon }) => (
  <Container>
    <Icon>{icon}</Icon>
    <Content>
      <div>
        <H2>{title}</H2>
        <H3>{subtitle}</H3>
      </div>
      <div>{children}</div>
    </Content>
  </Container>
);
