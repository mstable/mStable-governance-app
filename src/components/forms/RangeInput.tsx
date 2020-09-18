import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { Range, getTrackBackground } from 'react-range';
import { ViewportWidth } from '../../theme';

interface Props {
  min: number;
  max: number;
  value: number;
  startLabel?: string;
  endLabel?: string;
  onChange(value: number): void;
}

const RangeValue = styled.div<Pick<Props, 'max' | 'value'>>`
  position: relative;
  left: ${({ value, max }) => (100 / max) * value}%;
  width: 120px;
  margin-left: -60px;
  text-align: center;`;


const Container = styled.div`
  position: relative;
  margin: 0.5rem auto 0.5rem;
  padding-left: 50px;
  padding-right: 50px;
  
  @media (min-width: ${ViewportWidth.m}) {
    padding-right: none;
    padding-left: none;
  }
  `;

const LabelWrapper = styled.div`
display: flex;
justify-content: space-between;`;

export const RangeInput: FC<Props> = ({ min, max, value, onChange, startLabel, endLabel, children: valueLabel }) => {

  const handleChange = useCallback(([inputValue]: number[]) => {
    onChange(inputValue);
  }, [onChange]);

  return (
    <Container>
      <RangeValue max={max} value={value}>
        {valueLabel}
      </RangeValue>
      <Range
        step={1}
        min={min}
        max={max}
        values={[value]}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            style={{
              height: '6px',
              width: '100%',
              marginTop: '15px',
              marginBottom: '15px',
              background: getTrackBackground({
                values: [value],
                colors: ["rgb(23, 110, 222)", "#ccc"],
                min,
                max
              })
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            style={{
              outline: 'none',
              height: '20px',
              width: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          />
        )}
      />
      {startLabel && endLabel &&
        <LabelWrapper>
          <div>
            {startLabel}
          </div>
          <div>
            {endLabel}
          </div>
        </LabelWrapper>
      }
    </Container>
  )

}

