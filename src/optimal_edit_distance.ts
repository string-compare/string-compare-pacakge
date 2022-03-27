import {DpTable, ErrorItem, ErrorGroup, Operation} from './types';
import {create_error_obj} from './helpers';

export function edit_distance(genStr: string, expStr: string) {
  if (!genStr || !expStr) {
    throw new Error('One or more strings are empty');
  }

  const dpTable = generate_dp_table(genStr, expStr);
  const errorItemArray = generate_error_item_array(dpTable, genStr, expStr);
  return generate_error_group_array(errorItemArray);
}

/**
 *
 * This function generates the DP table for the given strings
 *
 * ex:
 * genStr: 'justin'
 * expStr: 'jusin'
 *
 *     j u s t i n
 *   0 1 2 3 4 5 6
 * j 1 0 1 2 3 4 5
 * u 2 1 0 1 2 3 4
 * s 3 2 1 0 1 2 3
 * i 4 3 2 1 1 1 2
 * n 5 4 3 2 2 2 1
 *
 */

function generate_dp_table(genStr: string, expStr: string) {
  const buffer = new ArrayBuffer(
    Math.pow(Math.max(genStr.length, expStr.length) + 1, 2) * 4
  );
  const dp_table: Array<Uint32Array> = new Array(genStr.length + 1);

  for (let i = 0; i < genStr.length + 1; i++) {
    const offset = i * (expStr.length + 1) * 4;
    const length = expStr.length + 1;
    dp_table[i] = new Uint32Array(buffer, offset, length);
  }

  for (let i = 0; i < genStr.length + 1; i++) {
    for (let j = 0; j < expStr.length + 1; j++) {
      dp_table[i][j] = i;
      if (i === 0) {
        dp_table[i][j] = j;
        continue;
      }
      if (j === 0) {
        dp_table[i][j] = i;
        continue;
      }
      if (genStr[i] === expStr[j]) {
        dp_table[i][j] = dp_table[i - 1][j - 1];
      } else {
        dp_table[i][j] =
          Math.min(
            dp_table[i][j - 1],
            dp_table[i - 1][j],
            dp_table[i - 1][j - 1]
          ) + 1;
      }
    }
  }

  return dp_table;
}

/**
 *
 * This function generates an array of error objects based
 * on where we find the divergences between the two strings
 *
 */

function generate_error_item_array(
  dpTable: DpTable,
  genStr: string,
  expStr: string
): Array<ErrorItem> {
  // Start at the bottom right corner of the table
  let [i, j] = [dpTable.length - 1, dpTable[0].length - 1];
  const errorList: Array<ErrorItem> = [];

  /**
   *
   * Determine the operation that is most performant at each
   * point in the table
   *
   */

  const find_min_char = (i: number, j: number) => {
    const costInsert = dpTable[i][j - 1];
    const costDelete = dpTable[i - 1][j];
    const costReplace = dpTable[i - 1][j - 1];

    const costArr = [
      {
        operation: Operation.INSERT,
        cost: costInsert,
        char: expStr[j - 1],
        index: j - 1,
        indexGen: i - 1,
        indexExp: j - 1,
      },
      {
        operation: Operation.DELETE,
        cost: costDelete,
        char: genStr[i - 1],
        index: i - 1,
        indexGen: i - 1,
        indexExp: j - 1,
      },
      {
        operation: Operation.REPLACE,
        cost: costReplace,
        char: expStr[j - 1],
        index: j - 1,
        indexGen: i - 1,
        indexExp: j - 1,
      },
    ];

    return costArr.reduce((arr, cur) => (cur.cost < arr.cost ? cur : arr));
  };

  /**
   * Traverse the table and create error list
   */

  while (i > 0 || j > 0) {
    // If letters are equal -> move i-1, j-1
    if (expStr[j - 1] === genStr[i - 1]) {
      i--;
      j--;
    } else {
      const {operation, char, index, indexGen, indexExp} = find_min_char(i, j);

      switch (operation) {
        case 'insert': //  if operation 'insert' -> move j - 1
          errorList.push(
            create_error_obj({char, index, indexGen, indexExp, operation})
          );
          j--;
          break;
        case 'delete': // if operation 'delete' -> move i - 1
          errorList.push(
            create_error_obj({char, index, indexGen, indexExp, operation})
          );
          i--;
          break;
        case 'replace': //  if operation 'replace' -> move i-1, j-1
          errorList.push(
            create_error_obj({char, index, indexGen, indexExp, operation})
          );
          i--;
          j--;
          break;
      }
    }
  }

  return errorList;
}

function generate_error_group_array(errorItemArray: Array<ErrorItem>) {
  // No Errors
  if (!errorItemArray.length) {
    return [];
  }

  // Create initial error group
  const finalErrorGroupArray: Array<ErrorGroup> = [
    {
      errorString: errorItemArray[errorItemArray.length - 1].char,
      startIndex: errorItemArray[errorItemArray.length - 1].index,
      endIndex: errorItemArray[errorItemArray.length - 1].index + 1,
      expIndices: [errorItemArray[errorItemArray.length - 1].indexExp],
      genIndices: [errorItemArray[errorItemArray.length - 1].indexGen],
      operation: errorItemArray[errorItemArray.length - 1].operation,
    },
  ];

  // No concatenation needed
  if (errorItemArray.length === 1) {
    return finalErrorGroupArray;
  }

  let i = errorItemArray.length - 2;
  while (i > -1) {
    // Determine if concatenation is needed
    if (
      errorItemArray[i].operation ===
      finalErrorGroupArray[finalErrorGroupArray.length - 1].operation
    ) {
      /**
       *
       *  Case 1. If errorItemArray[i].index === acc[acc.length - 1].endIndex -> delete or replace operations
       *
       */

      if (
        errorItemArray[i].index ===
        finalErrorGroupArray[finalErrorGroupArray.length - 1].endIndex
      ) {
        finalErrorGroupArray[finalErrorGroupArray.length - 1].endIndex += 1;
      }

      /**
       *
       *  Case 2. If errorItemArray[i].index === finalErrorGroupArray[] -> insert operation.
       *
       *  NOTE: The generated string will always show an index of the start of the insertion error
       *  therefore we need to auto increment the end index
       *
       */

      if (
        errorItemArray[i].index ===
        finalErrorGroupArray[finalErrorGroupArray.length - 1].startIndex
      ) {
        finalErrorGroupArray[finalErrorGroupArray.length - 1].endIndex =
          finalErrorGroupArray[finalErrorGroupArray.length - 1].endIndex + 1;
      }

      // Increment the end index
      finalErrorGroupArray[finalErrorGroupArray.length - 1].errorString +=
        errorItemArray[i].char;

      // Add new indices only if different than previous index
      if (
        finalErrorGroupArray[finalErrorGroupArray.length - 1].expIndices[
          finalErrorGroupArray[finalErrorGroupArray.length - 1].expIndices
            .length - 1
        ] !== errorItemArray[i].indexExp
      ) {
        finalErrorGroupArray[finalErrorGroupArray.length - 1].expIndices.push(
          errorItemArray[i].indexExp
        );
      }

      if (
        finalErrorGroupArray[finalErrorGroupArray.length - 1].genIndices[
          finalErrorGroupArray[finalErrorGroupArray.length - 1].genIndices
            .length - 1
        ] !== errorItemArray[i].indexGen
      ) {
        finalErrorGroupArray[finalErrorGroupArray.length - 1].genIndices.push(
          errorItemArray[i].indexGen
        );
      }
    }
    i--;
  }
  return finalErrorGroupArray;
}
