export declare enum Operation {
    INSERT = "insert",
    DELETE = "delete",
    REPLACE = "replace",
    INITIAL = ""
}
export interface ResultType {
    char: string;
    index: number;
    cost: number;
    operation: Operation;
}
export interface CostItem {
    cost: number;
    operation: Operation;
}
export interface ReducedErrorItem {
    errorString: string;
    startIndex: number;
    endIndex: number;
    operation: Operation;
}
