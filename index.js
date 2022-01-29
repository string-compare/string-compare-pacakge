"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Dp = void 0;
var Dp = /** @class */ (function () {
    function Dp(generatedString, expectedString) {
        this.genStr = generatedString;
        this.expStr = expectedString;
        this.resultTable = [];
        this.errorList = [];
    }
    // overall function
    Dp.prototype.editDistance = function () {
        this.generateDpTable();
        for (var i = 1; i <= this.genStr.length; i++) {
            for (var j = 1; j <= this.expStr.length; j++) {
                if (this.genStr[i - 1] === this.expStr[j - 1]) {
                    this.resultTable[i][j].cost = this.resultTable[i - 1][j - 1].cost;
                }
                else {
                    // insertion
                    var costInsert = this.resultTable[i][j - 1].cost + 1;
                    // deletion
                    var costDelete = this.resultTable[i - 1][j].cost + 1;
                    // substitution
                    var costReplace = this.resultTable[i - 1][j - 1].cost + 1;
                    // Find min cost & update result table
                    var _a = this.findMin(costInsert, costDelete, costReplace), operation = _a.operation, cost = _a.cost;
                    // set the value into the table
                    this.resultTable[i][j] = this.updateResultObj({
                        char: this.determineOperationString(operation, i - 1, j - 1),
                        index: j - 1,
                        context: "",
                        cost: cost,
                        operation: operation
                    });
                }
            }
        }
        this.findErrors();
    };
    // privates
    Dp.prototype.generateDpTable = function () {
        for (var i = 0; i <= this.genStr.length; i++) {
            if (!this.resultTable) {
                this.resultTable = [[]];
            }
            else {
                this.resultTable.push([]);
            }
            for (var j = 0; j <= this.expStr.length; j++) {
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
    };
    Dp.prototype.findMin = function (costInsert, costDelete, costReplace) {
        var costMap = [
            { cost: costInsert, operation: "insert" },
            { cost: costDelete, operation: "delete" },
            { cost: costReplace, operation: "replace" },
        ];
        return costMap.reduce(function (acc, cur) { return (cur.cost < acc.cost ? cur : acc); });
    };
    Dp.prototype.createResultObj = function (cost) {
        return {
            char: "",
            index: 0,
            context: "",
            cost: cost,
            operation: ""
        };
    };
    Dp.prototype.updateResultObj = function (_a) {
        var char = _a.char, index = _a.index, context = _a.context, cost = _a.cost, operation = _a.operation;
        return {
            char: char,
            index: index,
            context: context,
            cost: cost,
            operation: operation
        };
    };
    Dp.prototype.determineOperationString = function (operation, genIdx, expIdx) {
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
    };
    Dp.prototype.findErrors = function () {
        var _this = this;
        var _a = [
            this.resultTable.length - 1,
            this.resultTable[0].length - 1,
        ], i = _a[0], j = _a[1];
        var _findErrors = function (i, j) {
            if (i < 0 || j < 0)
                return;
            // If letters are equal -> move i-1, j-1
            if (_this.expStr[j - 1] === _this.genStr[i - 1]) {
                return _findErrors(i - 1, j - 1);
            }
            switch (_this.resultTable[i][j].operation) {
                case "insert": //  if opperation 'insert' -> move j - 1
                    _this.errorList.push(__assign({}, _this.resultTable[i][j]));
                    return _findErrors(i, j - 1);
                case "delete": // if opperation 'delete' -> move i - 1
                    _this.errorList.push(__assign({}, _this.resultTable[i][j]));
                    return _findErrors(i - 1, j);
                case "replace": //  if opperation 'replace' -> move i-1, j-1
                    _this.errorList.push(__assign({}, _this.resultTable[i][j]));
                    return _findErrors(i - 1, j - 1);
            }
        };
        _findErrors(i, j);
    };
    return Dp;
}());
exports.Dp = Dp;
