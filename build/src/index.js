"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dp = void 0;
const types_1 = require("./types");
class Dp {
    constructor(generatedString, expectedString) {
        this.genStr = generatedString;
        this.expStr = expectedString;
        this.resultTable = [];
        this.errorList = [];
    }
    // overall function
    editDistance() {
        this.generateDpTable();
        for (let i = 1; i <= this.genStr.length; i++) {
            for (let j = 1; j <= this.expStr.length; j++) {
                if (this.genStr[i - 1] === this.expStr[j - 1]) {
                    this.resultTable[i][j].cost = this.resultTable[i - 1][j - 1].cost;
                }
                else {
                    // insertion
                    const costInsert = this.resultTable[i][j - 1].cost + 1;
                    // deletion
                    const costDelete = this.resultTable[i - 1][j].cost + 1;
                    // substitution
                    const costReplace = this.resultTable[i - 1][j - 1].cost + 1;
                    // Find min cost & update result table
                    const { operation, cost } = this.findMin(costInsert, costDelete, costReplace);
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
    generateDpTable() {
        for (let i = 0; i <= this.genStr.length; i++) {
            if (!this.resultTable) {
                this.resultTable = [[]];
            }
            else {
                this.resultTable.push([]);
            }
            for (let j = 0; j <= this.expStr.length; j++) {
                if (i === 0) {
                    this.resultTable[i].push(this.createResultObj(j));
                }
                else if (j === 0) {
                    this.resultTable[i].push(this.createResultObj(i));
                }
                else {
                    this.resultTable[i].push(this.createResultObj(0));
                }
            }
        }
    }
    findMin(costInsert, costDelete, costReplace) {
        const costMap = [
            { cost: costInsert, operation: types_1.Operation.INSERT },
            { cost: costDelete, operation: types_1.Operation.DELETE },
            { cost: costReplace, operation: types_1.Operation.REPLACE },
        ];
        return costMap.reduce((acc, cur) => (cur.cost < acc.cost ? cur : acc));
    }
    createResultObj(cost) {
        return {
            char: '',
            index: 0,
            cost,
            operation: types_1.Operation.INITIAL,
        };
    }
    updateResultObj({ char, index, cost, operation, }) {
        return {
            char,
            index,
            cost,
            operation,
        };
    }
    determineChar(operation, genIdx, expIdx) {
        switch (operation) {
            case types_1.Operation.INSERT:
                return this.expStr[expIdx];
            case types_1.Operation.DELETE:
                return this.genStr[genIdx];
            case types_1.Operation.REPLACE:
                return this.expStr[expIdx];
            default:
                return types_1.Operation.INITIAL;
        }
    }
    findErrors() {
        const [i, j] = [
            this.resultTable.length - 1,
            this.resultTable[0].length - 1,
        ];
        const _findErrors = (i, j) => {
            if (i < 0 || j < 0)
                return;
            // If letters are equal -> move i-1, j-1
            if (this.expStr[j - 1] === this.genStr[i - 1]) {
                return _findErrors(i - 1, j - 1);
            }
            switch (this.resultTable[i][j].operation) {
                case 'insert': //  if operation 'insert' -> move j - 1
                    this.errorList.push({ ...this.resultTable[i][j] });
                    return _findErrors(i, j - 1);
                case 'delete': // if operation 'delete' -> move i - 1
                    this.errorList.push({ ...this.resultTable[i][j] });
                    return _findErrors(i - 1, j);
                case 'replace': //  if operation 'replace' -> move i-1, j-1
                    this.errorList.push({ ...this.resultTable[i][j] });
                    return _findErrors(i - 1, j - 1);
            }
        };
        _findErrors(i, j);
    }
    generateErrorArray() {
        return this.errorList.reduceRight((acc, cur, index) => {
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
exports.Dp = Dp;
// const insertExample = new Dp('this test', 'this is test go').editDistance();
// console.log(insertExample);
// const replaceExample = new Dp(
//   'this df test ew',
//   'this is test go'
// ).editDistance();
// console.log(replaceExample);
// const deleteExample = new Dp('this is test go', 'this not test').editDistance();
// console.log(deleteExample);
// const combinedExample = new Dp(
//   'guick brrown fix jumped on the fence',
//   'the quick brown fox jumps over the fence'
// ).editDistance();
// console.log(combinedExample);
const combinedExample = new Dp('guick', 'the quick').editDistance();
// should have solution of:
// {errorString: 'the ', startIndex: 0, endIndex: 4, operation: 'insert'},
// {errorString: 'g', startIndex: 5, endIndex: 6, operation: 'delete'},
console.log(combinedExample);
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
//# sourceMappingURL=index.js.map