import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { A, getWorkingPath } from 'hookrouter';
import { useCloseAccount } from '../../context/AppProvider';
import { FontSize, ViewportWidth } from '../../theme';
import { ExternalLink } from '../core/ExternalLink';

interface NavItem {
  title: string;
  path?: string;
  external?: boolean;
}

const Container = styled.nav`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (min-width: ${ViewportWidth.m}) {
    width: auto;
  }
`;

const Item = styled.li<{
  active: boolean;
}>`
  margin: 0 8px;
  position: relative;
  border-bottom: 4px solid transparent;
  font-weight: bold;
  text-transform: uppercase;
  padding: 2px 0;
  border-bottom-color: ${({ theme, active }) =>
    active ? theme.color.blue : 'transparent'};

  a,
  span {
    white-space: nowrap;
    color: ${({ theme, active }) =>
      active ? theme.color.blue : theme.color.offBlack};
    border-bottom: none;
  }

  &:hover > div {
    visibility: visible;
  }

  @media (min-width: ${ViewportWidth.s}) {
    font-size: ${FontSize.l};
  }
`;

const navItems: NavItem[] = [
  { title: 'Govern', path: '/govern' },
  { title: 'Stake', path: '/stake' },
  { title: 'Vote', path: 'https://snapshot.page/#/mstable', external: true },
];

/**
 * Placeholder component for app navigation.
 */
export const Navigation: FC<{}> = () => {
  const collapseWallet = useCloseAccount();
  const activePath = getWorkingPath('');
  const items: (NavItem & { active: boolean })[] = useMemo(
    () =>
      navItems.map(item => ({
        ...item,
        active: !!(item?.path && activePath.startsWith(item.path)),
      })),
    [activePath],
  );

  return (
    <Container>
      <List>
        {items.map(({ title, path, active, external }) => (
          <Item key={title} active={active} onClick={collapseWallet}>
            {path ? (
              external ? (
                <ExternalLink href={path}>{title}</ExternalLink>
              ) : (
                <A href={path}>{title}</A>
              )
            ) : (
              <span>{title}</span>
            )}
          </Item>
        ))}
      </List>
    </Container>
  );
};
