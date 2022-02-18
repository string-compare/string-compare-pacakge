import {DpTable, DpRow, ErrorItem, ErrorGroup, Operation} from './types';

function main(genStr: string, expStr: string) {
  const dpTable = generateDpTable(genStr, expStr);
  const errorItemArray = generateErrorItemArray(dpTable, genStr, expStr);
  return generateErrorGroupArray(errorItemArray);
}

/*

  This function generates the DP table for the given strings

  ex: 
  genStr: 'justin'
  expStr: 'jusin'

  //     j u s t i n
  //   0 1 2 3 4 5 6
  // j 1 0 1 2 3 4 5
  // u 2 1 0 1 2 3 4
  // s 3 2 1 0 1 2 3
  // i 4 3 2 1 1 1 2
  // n 5 4 3 2 2 2 1

*/
function generateDpTable(genStr: string, expStr: string) {
  return ` ${genStr}`.split('').reduce(
    (outterAcc: DpTable, _, outterIdx) => [
      ...outterAcc,
      ` ${expStr}`.split('').reduce((innerAcc: DpRow, _, innerIdx) => {
        if (outterIdx === 0) return [...innerAcc, innerIdx];
        if (innerIdx === 0) return [...innerAcc, outterIdx];
        if (genStr[outterIdx] === expStr[innerIdx])
          return [...innerAcc, outterAcc[outterIdx - 1][innerIdx - 1]];
        return [
          ...innerAcc,
          Math.min(
            outterAcc[outterIdx - 1][innerIdx - 1] + 1,
            outterAcc[outterIdx - 1][innerIdx] + 1,
            innerAcc[innerIdx - 1] + 1
          ),
        ];
      }, []),
    ],
    []
  );
}

/*

  This function generates an array of error objects based
  on where we find the divergences between the two strings

*/

function generateErrorItemArray(
  dpTable: DpTable,
  genStr: string,
  expStr: string
) {
  // Start at the bottom right corner of the table
  const [i, j] = [dpTable.length - 1, dpTable[0].length - 1];
  const errorList: Array<ErrorItem> = [];

  /*
    
    Determine the operation that is most performant at each
    point in the table

  */

  const findMinChar = (i: number, j: number) => {
    const costInsert = dpTable[i][j - 1];
    const costDelete = dpTable[i - 1][j];
    const costReplace = dpTable[i - 1][j - 1];

    const costArr = [
      {
        operation: Operation.INSERT,
        cost: costInsert,
        char: expStr[j - 1],
        index: j - 1,
      },
      {
        operation: Operation.DELETE,
        cost: costDelete,
        char: genStr[i],
        index: i - 1,
      },
      {
        operation: Operation.REPLACE,
        cost: costReplace,
        char: expStr[j - 1],
        index: j - 1,
      },
    ];

    return costArr.reduce((arr, cur) => (cur.cost < arr.cost ? cur : arr));
  };

  // This is the 'create' factory that creates fully operational result objects
  function createErrorObj({
    char,
    index,
    operation,
  }: {
    char: string;
    index: number;
    operation: Operation;
  }) {
    return {
      char,
      index,
      operation,
    };
  }

  /*

    Recursively traverse the table and create the error list

  */
  const _generateErrorItemArray = (i: number, j: number): void => {
    if (i < 0 || j < 0) return;
    // If letters are equal -> move i-1, j-1
    if (expStr[j - 1] === genStr[i - 1]) {
      return _generateErrorItemArray(i - 1, j - 1);
    }

    const {operation, char, index} = findMinChar(i, j);

    switch (operation) {
      case 'insert': //  if operation 'insert' -> move j - 1
        errorList.push(createErrorObj({char, index, operation}));
        return _generateErrorItemArray(i, j - 1);
      case 'delete': // if operation 'delete' -> move i - 1
        errorList.push(createErrorObj({char, index, operation}));
        return _generateErrorItemArray(i - 1, j);
      case 'replace': //  if operation 'replace' -> move i-1, j-1
        errorList.push(createErrorObj({char, index, operation}));
        return _generateErrorItemArray(i - 1, j - 1);
    }
  };

  _generateErrorItemArray(i, j);

  return errorList;
}

function generateErrorGroupArray(errorItemArray: Array<ErrorItem>) {
  return errorItemArray.reduceRight<ErrorGroup[]>((acc, cur, index) => {
    if (index === errorItemArray.length - 1) {
      // Initialize the Error Array
      return [
        {
          errorString: cur.char,
          startIndex: cur.index,
          endIndex: cur.index + 1,
          operation: cur.operation,
        },
      ];
    }

    // Determine if concatenation is needed
    if (cur.operation === acc[acc.length - 1].operation) {
      /*

          Case 1. If cur.index === acc[acc.length - 1].endIndex -> delete or replace operations

        */
      if (cur.index === acc[acc.length - 1].endIndex) {
        acc[acc.length - 1].errorString += cur.char;
        acc[acc.length - 1].endIndex += 1;
        return [...acc];
      }

      /*

          Case 2. If cur.index === acc[] -> insert operation.

          NOTE: The generated string will always show an index of the start of the insertion error
          therefore we need to auto increment the end index

        */

      if (cur.index === acc[acc.length - 1].startIndex) {
        acc[acc.length - 1].errorString += cur.char;
        acc[acc.length - 1].endIndex = acc[acc.length - 1].endIndex + 1;
        return [...acc];
      }
    }

    // Return concatenated object --> default case
    return [
      ...acc,
      {
        errorString: cur.char,
        startIndex: cur.index,
        endIndex: cur.index + 1,
        operation: cur.operation,
      },
    ];
  }, []);
}

console.log('final: ', main('nick', 'nwck'));
