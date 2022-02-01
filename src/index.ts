import {ResultType, CostItem, ReducedErrorItem, Operation} from './types';

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
            char: this.determineChar(operation, i - 1, j - 1),
            index: i - 1,
            cost,
            operation,
          });
        }
      }
    }

    this.findErrors();
    console.log('this.errorList', this.errorList);
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
      {cost: costInsert, operation: Operation.INSERT},
      {cost: costDelete, operation: Operation.DELETE},
      {cost: costReplace, operation: Operation.REPLACE},
    ];

    return costMap.reduce((acc, cur) => (cur.cost < acc.cost ? cur : acc));
  }

  private createResultObj(cost: number): ResultType {
    return {
      char: '',
      index: 0,
      cost,
      operation: Operation.INITIAL,
    };
  }

  private updateResultObj({
    char,
    index,
    cost,
    operation,
  }: {
    char: string;
    index: number;
    cost: number;
    operation: Operation;
  }) {
    return {
      char,
      index,
      cost,
      operation,
    };
  }

  private determineChar(
    operation: Operation,
    genIdx: number,
    expIdx: number
  ): string {
    switch (operation) {
      case Operation.INSERT:
        return this.expStr[expIdx];
      case Operation.DELETE:
        return this.genStr[genIdx];
      case Operation.REPLACE:
        return this.expStr[expIdx];
      default:
        return Operation.INITIAL;
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
        // Case 1. If cur.index === acc[acc.length - 1].endIndex -> delete or replace operations
        if (cur.index === acc[acc.length - 1].endIndex) {
          // do concatenation, or
          acc[acc.length - 1].errorString += cur.char;
          acc[acc.length - 1].endIndex += 1;

          return [...acc];
        }

        // Case 2. If cur.index === acc[] -> insert operation.
        //  NOTE: The generated string will always show an index of the start of the insertion error
        //        therefore we need to auto increment the end index
        if (cur.index === acc[acc.length - 1].startIndex) {
          // do concatenation, or
          acc[acc.length - 1].errorString += cur.char;
          acc[acc.length - 1].endIndex = acc[acc.length - 1].endIndex + 1;

          return [...acc];
        }
      }

      // return concatenated object
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
}

const combinedExample = new Dp('guick', 'the quick').editDistance();
console.log(combinedExample);

/* 
  Next:
  - Clean up code
  - Add comments
  - Add tests
  - figure out how it is confused

  - rollup

*/

// gen: guick       exp: the quick

//output:
// gen: [the q]{g}uick
// gen: |t|[he q]uick <-- current output
// gen: [the ]|q|uick
