import {ResultType, CostItem, ReducedErrorItem} from './types';

export class Dp {
  genStr: string;
  expStr: string;
  resultTable: Array<Array<ResultType>>;
  errorList: Array<ResultType>;

  constructor(generatedString: string, expectedString: string) {
    this.genStr = generatedString;
    this.expStr = expectedString;
    this.resultTable = [];
    this.errorList = [];
  }

  // overall function
  public editDistance() {
    this.generateDpTable();

    for (let i = 1; i <= this.genStr.length; i++) {
      for (let j = 1; j <= this.expStr.length; j++) {
        if (this.genStr[i - 1] === this.expStr[j - 1]) {
          this.resultTable[i][j].cost = this.resultTable[i - 1][j - 1].cost;
        } else {
          // insertion
          const costInsert = this.resultTable[i][j - 1].cost + 1;
          // deletion
          const costDelete = this.resultTable[i - 1][j].cost + 1;
          // substitution
          const costReplace = this.resultTable[i - 1][j - 1].cost + 1;

          // Find min cost & update result table
          const {operation, cost} = this.findMin(
            costInsert,
            costDelete,
            costReplace
          );

          // set the value into the table
          this.resultTable[i][j] = this.updateResultObj({
            char: this.determineOperationString(operation, i - 1, j - 1),
            index: operation === 'delete' ? i - 1 : j - 1, //add a function this.determineIndex()
            context: '',
            cost,
            operation,
          });
        }
      }
    }

    this.findErrors();
    console.log(this.errorList);
    return this.generateErrorArray();
  }

  // privates
  private generateDpTable() {
    for (let i = 0; i <= this.genStr.length; i++) {
      if (!this.resultTable) {
        this.resultTable = [[]];
      } else {
        this.resultTable.push([]);
      }
      for (let j = 0; j <= this.expStr.length; j++) {
        if (i === 0) {
          this.resultTable[i].push(this.createResultObj(j));
        } else if (j === 0) {
          this.resultTable[i].push(this.createResultObj(i));
        } else {
          this.resultTable[i].push(this.createResultObj(0));
        }
      }
    }
  }

  private findMin(costInsert: number, costDelete: number, costReplace: number) {
    const costMap: Array<CostItem> = [
      {cost: costInsert, operation: 'insert'},
      {cost: costDelete, operation: 'delete'},
      {cost: costReplace, operation: 'replace'},
    ];

    return costMap.reduce((acc, cur) => (cur.cost < acc.cost ? cur : acc));
  }

  private createResultObj(cost: number): ResultType {
    return {
      char: '',
      index: 0,
      context: '',
      cost,
      operation: '',
    };
  }

  private updateResultObj({
    char,
    index,
    context,
    cost,
    operation,
  }: {
    char: string;
    index: number;
    context: string;
    cost: number;
    operation: string;
  }) {
    return {
      char,
      index,
      context,
      cost,
      operation,
    };
  }

  private determineOperationString(
    operation: string,
    genIdx: number,
    expIdx: number
  ): string {
    switch (operation) {
      case 'insert':
        return this.expStr[expIdx];
      case 'deletion':
        return this.genStr[genIdx];
      case 'replace':
        return this.expStr[expIdx];
      default:
        return '';
    }
  }

  private findErrors() {
    const [i, j] = [
      this.resultTable.length - 1,
      this.resultTable[0].length - 1,
    ];

    const _findErrors = (i: number, j: number): void => {
      if (i < 0 || j < 0) return;
      // If letters are equal -> move i-1, j-1
      if (this.expStr[j - 1] === this.genStr[i - 1]) {
        return _findErrors(i - 1, j - 1);
      }
      switch (this.resultTable[i][j].operation) {
        case 'insert': //  if operation 'insert' -> move j - 1
          this.errorList.push({...this.resultTable[i][j]});
          return _findErrors(i, j - 1);
        case 'delete': // if operation 'delete' -> move i - 1
          this.errorList.push({...this.resultTable[i][j]});
          return _findErrors(i - 1, j);
        case 'replace': //  if operation 'replace' -> move i-1, j-1
          this.errorList.push({...this.resultTable[i][j]});
          return _findErrors(i - 1, j - 1);
      }
    };
    _findErrors(i, j);
  }

  private generateErrorArray() {
    return this.errorList.reduceRight<ReducedErrorItem[]>((acc, cur, index) => {
      if (index === this.errorList.length - 1) {
        return [
          {
            errorString: cur.char,
            startIndex: cur.index,
            endIndex: cur.index + 1,
          },
        ];
      }

      // determine if concatenation is needed
      if (cur.index === acc[acc.length - 1].endIndex) {
        // do concatenation, or
        acc[acc.length - 1].errorString += cur.char;
        acc[acc.length - 1].endIndex += 1;

        return [...acc];
      }

      // return concatenated object
      return [
        ...acc,
        {
          errorString: cur.char,
          startIndex: cur.index,
          endIndex: cur.index + 1,
        },
      ];
    }, []);
  }
}

// const insertExample = new Dp('this test', 'this is test go').editDistance();
// console.log(insertExample);

// const replaceExample = new Dp(
//   'this df test ew',
//   'this is test go'
// ).editDistance();
// console.log(replaceExample);

const deleteExample = new Dp('this is test go', 'this test').editDistance();
console.log(deleteExample);
/*
exp: The quick brown fox jumps over the fence
gen: the brown fix jumpeasdfsasdfwerwghd over the fence

errors: [
  {operation: insert, error: quick, startIndex:4 },
  {operation: replace, error: i, startIndex: 10},
  {operation: }
]
*/

/* 
  Next:
  1. get char for deletes
  2. Cleanup
  3. testing (really think of edge cases)
  4. learn about rollup
  5. deploy to npm
*/