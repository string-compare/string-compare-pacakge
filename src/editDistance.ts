import {DpTable, DpRow, ErrorItem, ErrorGroup, Operation} from './types';

function main(genStr: string, expStr: string) {
  const dpTable = generateDpTable(genStr, expStr);
  console.log('dptable: ', dpTable);
  const errorItemArray = generateErrorItemArray(dpTable, genStr, expStr);
  console.log('error item array: ', errorItemArray);
}

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

function generateErrorItemArray(
  dpTable: DpTable,
  genStr: string,
  expStr: string
) {
  const [i, j] = [dpTable.length - 1, dpTable[0].length - 1];
  const errorList: Array<ErrorItem> = [];

  const findMinChar = (i: number, j: number) => {
    const costInsert = dpTable[i][j - 1];
    const costDelete = dpTable[i - 1][j];
    const costReplace = dpTable[i - 1][j - 1];

    const costArr = [
      {
        operation: Operation.INSERT,
        cost: costInsert,
        char: expStr[i - 1],
        index: i - 1,
      },
      {
        operation: Operation.DELETE,
        cost: costDelete,
        char: genStr[j],
        index: j - 1,
      },
      {
        operation: Operation.REPLACE,
        cost: costReplace,
        char: expStr[i - 1],
        index: i - 1,
      },
    ];

    return costArr.reduce((arr, cur) => (cur.cost < arr.cost ? cur : arr));
  };

  // This is the 'update' factory that creates fully operational result objects
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

main('nick', 'nwck');
