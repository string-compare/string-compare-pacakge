export enum Operation {
  INSERT = 'insert',
  DELETE = 'delete',
  REPLACE = 'replace',
  INITIAL = '',
}

export type DpTable = Array<DpRow>;

export type DpRow = Array<number>;
export interface ErrorItem {
  char: string;
  index: number;
  cost?: number;
  operation: Operation;
}
export interface ErrorGroup {
  errorString: string;
  startIndex: number;
  endIndex: number;
  operation: Operation;
}

export interface CostItem {
  cost: number;
  operation: Operation;
}
