import { Tokens } from './TokensProvider';

export interface RawData {
  tokens: Tokens;
}

export type PartialRawData = {
  tokens: RawData['tokens'];
};

// TODO
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataState {}
