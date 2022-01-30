import { ResultType } from './types';
export declare class Dp {
    genStr: string;
    expStr: string;
    resultTable: Array<Array<ResultType>>;
    errorList: Array<ResultType>;
    constructor(generatedString: string, expectedString: string);
    editDistance(): ResultType[];
    private generateDpTable;
    private findMin;
    private createResultObj;
    private updateResultObj;
    private determineOperationString;
    private findErrors;
}
