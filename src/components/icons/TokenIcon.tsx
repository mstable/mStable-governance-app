import React, { FC, SVGProps } from 'react';
import styled from 'styled-components';
import MTA, { ReactComponent as MtaSvg } from './tokens/MTA.svg';
import ETH, { ReactComponent as EtherSvg } from './tokens/Ether.svg';

interface Props {
  className?: string;
  symbol: string;
}

type SvgProps = Props & SVGProps<never>;

type SvgComponent = FC<SVGProps<never>>;

export const TOKEN_ICONS: Record<string, string> = {
  ETH,
  WETH: ETH,
  MTA,
  'MK-MTA': MTA,
};

const SVG_ICONS: Record<string, SvgComponent> = {
  ETH: EtherSvg as SvgComponent,
  WETH: EtherSvg as SvgComponent,
  MTA: MtaSvg as SvgComponent,
  'MK-MTA': MtaSvg as SvgComponent,
};

const Image = styled.img`
  width: 100%;
  height: auto;
`;

export const TokenIcon: FC<Props> = ({ className, symbol }) =>
  TOKEN_ICONS[symbol.toUpperCase()] ? (
    <Image
      alt={symbol}
      src={TOKEN_ICONS[symbol.toUpperCase()]}
      className={className}
    />
  ) : null;

export const TokenIconSvg: FC<SvgProps> = ({ symbol, width, height, x, y }) => {
  if (!SVG_ICONS[symbol.toUpperCase()]) return null;
  const Icon = SVG_ICONS[symbol.toUpperCase()];
  return <Icon width={width} height={height} x={x} y={y} />;
};
