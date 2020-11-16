import React, { ComponentProps, FC } from 'react';
import styled from 'styled-components';

import { ExternalLink } from './ExternalLink';

const StyledExternalLink = styled(ExternalLink)<{ arrow?: boolean }>`
  font-weight: 600;

  &:before {
    // Right arrow and nbsp
    content: ${({ arrow }) => (arrow ? '"\\2794\\a0"' : 'none')};
  }
`;

export const CTA: FC<ComponentProps<typeof ExternalLink> & {
  arrow?: boolean;
  externalArrow?: boolean;
}> = ({ arrow = true, externalArrow, children, className, title, href }) => {
  return (
    <StyledExternalLink
      className={className}
      href={href}
      title={title}
      arrow={arrow}
      externalArrow={externalArrow}
    >
      {children}
    </StyledExternalLink>
  );
};
