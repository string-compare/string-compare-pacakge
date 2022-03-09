export declare enum Operation {
    INSERT = "insert",
    DELETE = "delete",
    REPLACE = "replace",
    INITIAL = ""
}
export declare type DpTable = Array<DpRow>;
export declare type DpRow = Array<number>;
export interface ErrorItem {
    char: string;
    index: number;
    indexGen: number;
    indexExp: number;
    cost?: number;
    operation: Operation;
}
export interface ErrorGroup {
    errorString: string;
    startIndex: number;
    endIndex: number;
    genIndices: Array<number>;
    expIndices: Array<number>;
    operation: Operation;
}
export interface CostItem {
    cost: number;
    operation: Operation;
}
