import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers/utils';
import { ViewportWidth } from '../../../theme';
import { CountUp } from '../../core/CountUp';
import DiagonalArrow from '../../icons/diagonal-arrow.svg';
import LeftArrow from '../../icons/left-arrow.svg';
import MTAIcon from '../../icons/tokens/MTA.svg';
import EtherIcon from '../../icons/tokens/Ether.svg';
import { getEtherscanLink, truncateAddress } from '../../../utils/strings';

const Container = styled.div`
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 1rem;
  justify-self: flex-end;
  display: flex;
  flex-direction: column;

  @media (min-width: ${ViewportWidth.xl}) {
    flex-basis: calc(45% - 0.5rem);
    margin: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.5rem;
    line-height: 1em;
    font-weight: 600;
    margin-right: 1rem;
  }

  p {
    font-size: 0.875rem;
    color: #808080;

    > span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  div {
    display: flex;
  }

  @media (min-width: ${ViewportWidth.s}) {
    a > span {
      display: inline;
    }
  }
`;

const Items = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;

  > * {
    margin-right: 1rem;
  }
`;

const StyledRow = styled.button`
  display: flex;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  background: #f7f8f9;
  border-radius: 1.25rem;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;

  &:focus,
  :active {
    outline: none;
    box-shadow: 0 0 2px inset ${({ theme }) => theme.color.blue};
  }

  &:hover {
    background: #ececec;
  }
`;

const StyledToken = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2rem;

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-size: 1.125rem;
  }
`;

const Circle = styled.div<{ color: string }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.625rem;
  margin-right: 0.5rem;
  background: ${({ color }) => color};
  overflow: hidden;

  > * {
    width: 100%;
    height: 100%;
  }
`;

const Address = styled.a`
  ${({ theme }) => theme.mixins.numeric};

  background: url(${DiagonalArrow}) #f7f8f9 no-repeat;
  background-position-x: 95%;
  background-position-y: 50%;
  background-size: 1.25rem;
  padding: 0.25rem 2.25rem 0.25rem 0.75rem;
  border: none;
  border-radius: 0.75rem;

  &:hover {
    cursor: pointer;

    span {
      border-bottom: 1px solid #000;
    }
  }
`;

const NavigateButton = styled.button`
  background: url(${LeftArrow}) no-repeat;
  background-position-x: 50%;
  background-position-y: 50%;
  width: 1.25rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  border: none;
`;

const DefaultRow: FC<{
  title: string;
  color: string;
  index: number;
  onClick: (i: number) => void;
}> = ({ title, color, index, onClick }) => (
  <StyledRow onClick={() => onClick(index)}>
    <Circle color={color} />
    {title}
  </StyledRow>
);

type TokenRowProps = { amount?: BigNumber; image?: string };

const TokenRow: FC<TokenRowProps> = ({ image, amount }) => {
  const valueRounded = amount && Math.floor(amount.toNumber());
  return (
    <StyledToken>
      <Circle color="#eee">
        <img src={image} alt="mta" />
      </Circle>
      <CountUp end={valueRounded} decimals={0} />
    </StyledToken>
  );
};

enum State {
  DEFAULT = 'default',
  MSTABLE = 'mstable',
  COMMUNITY = 'community',
  PROTOCOL = 'protocol',
}

const { DEFAULT, MSTABLE, COMMUNITY, PROTOCOL } = State;

const mapTitleForState = (state: State): string => {
  switch (state) {
    case DEFAULT:
      return 'DAOs';
    case MSTABLE:
      return 'mStable';
    case COMMUNITY:
      return 'Community';
    case PROTOCOL:
      return 'Protocol';
    default:
      return '';
  }
};

const mapAddressForState = (state: State): string | undefined => {
  switch (state) {
    case MSTABLE:
      return '0xb8541e73aa47a847fa39e803d19a3f9b1bbc5a6c';
    case COMMUNITY:
      return '0xb8541e73aa47a847fa39e803d19a3f9b1bbc5a6c';
    case PROTOCOL:
      return '0xb8541e73aa47a847fa39e803d19a3f9b1bbc5a6c';
    default:
      return undefined;
  }
};

const itemColors = ['#000', '#4C4FA8', '#CC1010', '#4C4FA8', '#000'];

const mockTokens: { image: string; amount: BigNumber }[] = [
  {
    image: MTAIcon,
    amount: new BigNumber(12010),
  },
  {
    image: EtherIcon,
    amount: new BigNumber(1231),
  },
  {
    image: MTAIcon,
    amount: new BigNumber(23043),
  },
];

export const GovernDAO: FC = () => {
  const [state, setState] = useState<State>(State.DEFAULT);
  const items = [
    State.MSTABLE,
    State.COMMUNITY,
    State.PROTOCOL,
    State.COMMUNITY,
    State.PROTOCOL,
  ];
  const isDefault = state === State.DEFAULT;

  const handleNavigationBack = useCallback(() => setState(State.DEFAULT), []);

  const handleDAOSelection = useCallback(
    (i: number | undefined) => setState(items[i ?? -1] ?? State.DEFAULT),
    [items],
  );

  const title = mapTitleForState(state);
  const address = mapAddressForState(state);

  // mocked
  const tokenMapping: Map<State, TokenRowProps[]> = new Map([
    [MSTABLE, mockTokens],
    [COMMUNITY, mockTokens],
    [PROTOCOL, []],
  ]); //

  const tokens = tokenMapping.get(state);

  return (
    <Container>
      <Header>
        <div>
          {!isDefault && (
            <NavigateButton type="button" onClick={handleNavigationBack} />
          )}
          <h3>{title}</h3>
        </div>
        {address && (
          <Address
            target="_blank"
            rel="noopener noreferrer"
            href={getEtherscanLink(address, 'address')}
          >
            <span>{truncateAddress(address)}</span>
          </Address>
        )}
      </Header>
      <Items>
        {isDefault &&
          items.map((item, i) => (
            <DefaultRow
              index={i}
              key={`${item}-select`}
              title={mapTitleForState(item)}
              color={itemColors[i]}
              onClick={handleDAOSelection}
            />
          ))}
        {!isDefault &&
          (tokens?.length !== 0 ? (
            tokens?.map(({ image, amount }, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <TokenRow image={image} amount={amount} key={`${i}-token`} />
            ))
          ) : (
            <p>This DAO manages no funds.</p>
          ))}
      </Items>
    </Container>
  );
};
