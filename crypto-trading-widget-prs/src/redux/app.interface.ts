import { Token } from '../data/tokens/token.interface';

export interface TokenList {
  tokens: Token[];
  youPayToken: Token;
  youReceiveToken: Token;
  status?: 'loading' | 'done';
}
