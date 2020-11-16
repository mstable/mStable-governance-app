import React, { AnchorHTMLAttributes, FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as ExternalLinkArrow } from './external-link-arrow.svg';

const Anchor = styled.a`
  border-bottom: 0;
  text-decoration: none;
  color: ${({ theme }) => theme.color.blue};
  font-weight: 700;
  transition: color 1s ease;

  &:hover {
    color: ${({ theme }) => theme.color.gold};
  }

  svg {
    margin-left: 4px;
    width: 14px;
    height: auto;
  }
`;

export const ExternalLink: FC<AnchorHTMLAttributes<never> & {
  externalArrow?: boolean;
}> = ({ children, className, href, externalArrow = true }) => (
  <Anchor
    className={className}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>{children}</span>
    {externalArrow && <ExternalLinkArrow />}
  </Anchor>
);
