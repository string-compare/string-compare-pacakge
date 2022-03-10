import {Operation} from './types';

// This is the 'create' factory that creates fully operational result objects
export function create_error_obj({
  char,
  index,
  indexGen,
  indexExp,
  operation,
}: {
  char: string;
  index: number;
  indexGen: number;
  indexExp: number;
  operation: Operation;
}) {
  return {
    char,
    index,
    indexGen,
    indexExp,
    operation,
  };
}
