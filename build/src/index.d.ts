import { ResultType, ReducedErrorItem } from './types';
export declare class Dp {
    genStr: string;
    expStr: string;
    resultTable: Array<Array<ResultType>>;
    errorList: Array<ResultType>;
    constructor(generatedString: string, expectedString: string);
    editDistance(): ReducedErrorItem[];
    private generateDpTable;
    private findMin;
    private createResultObj;
    private updateResultObj;
    private determineChar;
    private findErrors;
    private generateErrorArray;
}
