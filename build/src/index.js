"use strict";
// import {ErrorItem, CostItem, ErrorGroup, Operation} from './types';
// export class Dp {
//   // String result from function
//   genStr: string;
//   // String that is the generated string is expected to equal
//   expStr: string;
//   // DP table that stores the cost and maps to the values desired
//   resultTable: Array<Array<ErrorItem>>;
//   // Actual diversions between Generated and Expected Strings
//   errorList: Array<ErrorItem>;
//   constructor(generatedString: string, expectedString: string) {
//     this.genStr = generatedString;
//     this.expStr = expectedString;
//     this.resultTable = [];
//     this.errorList = [];
//   }
//   /* PUBLIC FUNCTIONS */
//   public editDistance() {
//     this.generateResultTable();
//     for (let i = 1; i <= this.genStr.length; i++) {
//       for (let j = 1; j <= this.expStr.length; j++) {
//         if (this.genStr[i - 1] === this.expStr[j - 1]) {
//           this.resultTable[i][j].cost = this.resultTable[i - 1][j - 1].cost;
//         } else {
//           // Find the costs for each operation
//           const {costInsert, costDelete, costReplace} = this.findCosts(i, j);
//           // Find the minimum cost
//           const {operation, cost} = this.findMin(
//             costInsert,
//             costDelete,
//             costReplace
//           );
//           // Update the results table with the minimum cost
//           this.resultTable[i][j] = this.updateResultObj({
//             char: this.findChar(operation, i - 1, j - 1),
//             index: i - 1,
//             cost,
//             operation,
//           });
//         }
//       }
//     }
//     this.findErrors();
//     console.log('this.errorList', this.errorList);
//     return this.generateErrorArray();
//   }
//   /* PRIVATE FUNCTIONS */
//   private generateResultTable() {
//     /*
//       Initialize the results table.
//       The first row represents the result given an empty generated string against
//       the expected string. This is represented by loading each item in the first
//       sub array with the index of the expected string.
//       The first column (the first item in each row) represents the result given an
//       empty expected string.
//     */
//     for (let i = 0; i <= this.genStr.length; i++) {
//       if (!this.resultTable) {
//         this.resultTable = [[]];
//       } else {
//         this.resultTable.push([]);
//       }
//       for (let j = 0; j <= this.expStr.length; j++) {
//         if (i === 0) {
//           this.resultTable[i].push(this.createInitialResultObj(j));
//         } else if (j === 0) {
//           this.resultTable[i].push(this.createInitialResultObj(i));
//         } else {
//           this.resultTable[i].push(this.createInitialResultObj(0));
//         }
//       }
//     }
//   }
//   // Determine the cost of each operation
//   private findCosts(i: number, j: number) {
//     return {
//       costInsert: this.resultTable[i][j - 1].cost + 1,
//       costDelete: this.resultTable[i - 1][j].cost + 1,
//       costReplace: this.resultTable[i - 1][j - 1].cost + 1,
//     };
//   }
//   // This takes the determined costs from 'findCosts' and returns the minimum cost
//   private findMin(costInsert: number, costDelete: number, costReplace: number) {
//     const costMap: Array<CostItem> = [
//       {cost: costInsert, operation: Operation.INSERT},
//       {cost: costDelete, operation: Operation.DELETE},
//       {cost: costReplace, operation: Operation.REPLACE},
//     ];
//     return costMap.reduce((acc, cur) => (cur.cost < acc.cost ? cur : acc));
//   }
//   // This is the initial creation 'factory' for making result objects
//   private createInitialResultObj(cost: number): ErrorItem {
//     return {
//       char: '',
//       index: 0,
//       cost,
//       operation: Operation.INITIAL,
//     };
//   }
//   // This is the 'update' factory that creates fully operational result objects
//   private updateResultObj({
//     char,
//     index,
//     cost,
//     operation,
//   }: {
//     char: string;
//     index: number;
//     cost: number;
//     operation: Operation;
//   }) {
//     return {
//       char,
//       index,
//       cost,
//       operation,
//     };
//   }
//   /*
//     Since we are operating from the Generated string, against the Expected string,
//     we need to determine the character that was changed on the generated string. In the
//     Insert and Replace cases the charecter that is needed for the change is found on the
//     expected string, but in the deletion case the char is found on the generated string.
//     This function determines the char that is needed for the change, by using the above
//     logic chained off of the operation.
//   */
//   private findChar(
//     operation: Operation,
//     genIdx: number,
//     expIdx: number
//   ): string {
//     switch (operation) {
//       case Operation.INSERT:
//         return this.expStr[expIdx];
//       case Operation.DELETE:
//         return this.genStr[genIdx];
//       case Operation.REPLACE:
//         return this.expStr[expIdx];
//       default:
//         return Operation.INITIAL;
//     }
//   }
//   /*
//     Find errors uses a recursive helper to traverse the results table and find the
//     find which characters were changed. Each instance of a change is added to the
//     errorList array.
//   */
//   private findErrors() {
//     const [i, j] = [
//       this.resultTable.length - 1,
//       this.resultTable[0].length - 1,
//     ];
//     const _findErrors = (i: number, j: number): void => {
//       if (i < 0 || j < 0) return;
//       // If letters are equal -> move i-1, j-1
//       if (this.expStr[j - 1] === this.genStr[i - 1]) {
//         return _findErrors(i - 1, j - 1);
//       }
//       switch (this.resultTable[i][j].operation) {
//         case 'insert': //  if operation 'insert' -> move j - 1
//           this.errorList.push({...this.resultTable[i][j]});
//           return _findErrors(i, j - 1);
//         case 'delete': // if operation 'delete' -> move i - 1
//           this.errorList.push({...this.resultTable[i][j]});
//           return _findErrors(i - 1, j);
//         case 'replace': //  if operation 'replace' -> move i-1, j-1
//           this.errorList.push({...this.resultTable[i][j]});
//           return _findErrors(i - 1, j - 1);
//       }
//     };
//     _findErrors(i, j);
//   }
//   private generateErrorArray() {
//     return this.errorList.reduceRight<ReducedErrorItem[]>((acc, cur, index) => {
//       if (index === this.errorList.length - 1) {
//         // Initialize the Error Array
//         return [
//           {
//             errorString: cur.char,
//             startIndex: cur.index,
//             endIndex: cur.index + 1,
//             operation: cur.operation,
//           },
//         ];
//       }
//       // Determine if concatenation is needed
//       if (cur.operation === acc[acc.length - 1].operation) {
//         /*
//           Case 1. If cur.index === acc[acc.length - 1].endIndex -> delete or replace operations
//         */
//         if (cur.index === acc[acc.length - 1].endIndex) {
//           acc[acc.length - 1].errorString += cur.char;
//           acc[acc.length - 1].endIndex += 1;
//           return [...acc];
//         }
//         /*
//           Case 2. If cur.index === acc[] -> insert operation.
//           NOTE: The generated string will always show an index of the start of the insertion error
//           therefore we need to auto increment the end index
//         */
//         if (cur.index === acc[acc.length - 1].startIndex) {
//           acc[acc.length - 1].errorString += cur.char;
//           acc[acc.length - 1].endIndex = acc[acc.length - 1].endIndex + 1;
//           return [...acc];
//         }
//       }
//       // Return concatenated object --> default case
//       return [
//         ...acc,
//         {
//           errorString: cur.char,
//           startIndex: cur.index,
//           endIndex: cur.index + 1,
//           operation: cur.operation,
//         },
//       ];
//     }, []);
//   }
// }
// const combinedExample = new Dp('guick', 'the quick').editDistance();
// console.log(combinedExample);
// /*
//   Next:
//   - Clean up code
//   - Add comments
//   - Add tests
//   - figure out how it is confused
//   - rollup
// */
// // gen: guick       exp: the quick
// // output:
// // gen: [the q]{g}uick
// // gen: |t|[he q]uick <-- current output
// // gen: [the ]|q|uick
// //Integration
// // import editDistance from 'library-name';
// // const expStr = 'expected string'
// // const genStr = 'generated string'
// // const diff = editDistance(genStr, expStr)
//# sourceMappingURL=index.js.map