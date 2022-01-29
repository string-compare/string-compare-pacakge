interface ResultType {
  char: string;
  index: number;
  context: string;
  cost: number;
  operation: string;
}

interface CostItem {
  cost: number;
  operation: string;
}

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
          const { operation, cost } = this.findMin(
            costInsert,
            costDelete,
            costReplace
          );

          // set the value into the table
          this.resultTable[i][j] = this.updateResultObj({
            char: this.determineOperationString(operation, i - 1, j - 1),
            index: j - 1,
            context: "",
            cost,
            operation,
          });
        }
      }
    }

    this.findErrors();
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
      { cost: costInsert, operation: "insert" },
      { cost: costDelete, operation: "delete" },
      { cost: costReplace, operation: "replace" },
    ];

    return costMap.reduce((acc, cur) => (cur.cost < acc.cost ? cur : acc));
  }

  private createResultObj(cost: number): ResultType {
    return {
      char: "",
      index: 0,
      context: "",
      cost,
      operation: "",
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
      case "insert":
        return this.expStr[expIdx];
      case "deletion":
        return this.genStr[genIdx];
      case "replace":
        return this.expStr[expIdx];
      default:
        return "";
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
        case "insert": //  if opperation 'insert' -> move j - 1
          this.errorList.push({ ...this.resultTable[i][j] });
          return _findErrors(i, j - 1);
        case "delete": // if opperation 'delete' -> move i - 1
          this.errorList.push({ ...this.resultTable[i][j] });
          return _findErrors(i - 1, j);
        case "replace": //  if opperation 'replace' -> move i-1, j-1
          this.errorList.push({ ...this.resultTable[i][j] });
          return _findErrors(i - 1, j - 1);
      }
    };
    _findErrors(i, j);
  }
}
