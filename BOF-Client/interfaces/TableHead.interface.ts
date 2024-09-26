import React, { ReactElement } from 'react';

export enum ValueTypeEnum {
  DATE = 'date',
  NUMBER = 'number',
  BIG_NUMBER = 'bigNumber',
  STRING = 'string',
  LINK = 'link',
  TOKEN = 'token',
  PAIR = 'pair',
  BOOLEAN = 'boolean',
  ACTION = 'action',
  PL_ACTION = 'pl_action',
  CHAINS = 'chains',
  DROPDOWN = 'dropdown',
}

export type ClassNameType =
  | 'greenColor'
  | 'redColor'
  | 'yellowColor'
  | 'violetColor'
  | 'violetUnderlinedColor'
  | 'disable'
  | 'yellowWithoutUnderlineColor';

interface AddStyleRule {
  params: string[];
  calc: (...params: string[]) => ClassNameType;
}
interface AddValueRule {
  params: string[];
  calc: (...params: unknown[]) => any;
}
interface CheckBy {
  params: string[];
  calc: (...params: string[]) => boolean;
}

export interface ITableHead {
  subInfoComponent?: React.ReactNode;
  alias: string;
  name: string;
  translateName?: string;
  type: ValueTypeEnum;
  sortByDefault?: boolean;
  digitToRound?: number;
  additionalSymbolLeft?: string;
  additionalSymbolRight?: string;
  _addStyleRule?: AddStyleRule;
  _addValueRule?: AddValueRule;
  link?: (columnValue: any) => ReactElement<any, any>;
  asc?: boolean;
  sort: boolean;
  rows?: number;
  columns?: number;
  borderRight?: boolean;
  _isCheckBy?: CheckBy;
  ifCheckTrueShowPrefix?: string;
  isNotRound?: boolean;
  helperText?: string;
  withIcon?: boolean;
  showTokenName?: boolean;
  isTranslate?: boolean;
  iconSize?: number;
}
