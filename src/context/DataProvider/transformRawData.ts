import { DataState, RawData } from './types';

type TransformFn<T extends keyof DataState> = (
  rawData: RawData,
  dataState: DataState,
) => DataState[T];

type TransformPipelineItem<T extends keyof DataState> = [T, TransformFn<T>];

const pipelineItems: TransformPipelineItem<keyof DataState>[] = [];

export const transformRawData = (rawData: RawData): DataState =>
  pipelineItems.reduce(
    (_dataState, [key, transform]) => ({
      ..._dataState,
      [key]: transform(rawData, _dataState as DataState),
    }),
    {} as Partial<DataState>,
  ) as DataState;
