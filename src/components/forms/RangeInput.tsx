/* eslint-disable-next-line react/jsx-props-no-spreading */
import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { Range, getTrackBackground } from 'react-range';
import { IThumbProps } from 'react-range/lib/types';

import { Color, ViewportWidth } from '../../theme';

interface Props {
  min: number;
  max: number;
  value: number;
  startLabel?: string;
  endLabel?: string;
  onChange(value: number): void;
}

const ThumbCircle = styled.div`
  outline: none;
  height: 16px;
  width: 16px;
  background-color: white;
  border-radius: 100%;
  border: 1px #eee solid;
`;

const ThumbLabel = styled.div`
  text-align: center;
  text-transform: uppercase;
  background: ${Color.offWhite};
  padding: 4px;
  border-radius: 4px;

  > :first-child {
    font-weight: bold;
    font-size: 12px;
  }
`;

const ThumbContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  top: 24px;
  height: 64px;
`;

const Thumb: FC<Partial<IThumbProps>> = ({ children, ...props }) => (
  <ThumbContainer {...props}>
    <ThumbCircle />
    <ThumbLabel>{children}</ThumbLabel>
  </ThumbContainer>
);

const Label = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
`;

const Track = styled.div<Pick<Props, 'value' | 'min' | 'max'>>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 16px;
  margin: 0 16px;
  background: ${({ value, min, max }) =>
    getTrackBackground({
      values: [value],
      colors: [Color.blue, '#ccc'],
      min,
      max,
    })};

  // Haxx in order to stop the circle from going beyond the ends of the track
  // (visually, that is)
  &:before,
  &:after {
    display: block;
    content: '';
    width: 16px;
    height: 16px;
  }
  &:before {
    margin-left: -8px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background: ${({ value, min }) =>
      getTrackBackground({
        values: [value],
        colors: [Color.blue, '#ccc'],
        min,
        max: 8,
      })};
  }
  &:after {
    margin-right: -8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    background: ${({ value, max }) =>
      getTrackBackground({
        values: [value],
        colors: [Color.blue, '#ccc'],
        min: max - 2,
        max,
      })};
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  min-height: 60px;

  @media (min-width: ${ViewportWidth.m}) {
    padding-left: 0;
    padding-right: 0;
  }
`;

export const RangeInput: FC<Props> = ({
  min,
  max,
  value,
  onChange,
  startLabel,
  endLabel,
  children,
}) => {
  const handleChange = useCallback(
    ([inputValue]: number[]) => {
      onChange(inputValue);
    },
    [onChange],
  );

  return (
    <Container>
      {startLabel && <Label>{startLabel}</Label>}
      <Range
        step={1}
        min={min}
        max={max}
        values={[value]}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <Track {...props} value={value} min={min} max={max}>
            {children}
          </Track>
        )}
        renderThumb={({ props: { ref: _, ...props } }) => (
          <Thumb {...props}>{children}</Thumb>
        )}
      />
      {endLabel && <Label>{endLabel}</Label>}
    </Container>
  );
};
