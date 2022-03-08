"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editDistance_1 = require("../editDistance");
/**
 *   errorString: string;
  startIndex: number;
  endIndex: number;
  operation: Operation;
 */
describe('edit_distance', () => {
    it('should return the correct array of results', () => {
        const result = (0, editDistance_1.main)('justin', 'jusin');
        const expectedResult = [
            {
                errorString: 't',
                startIndex: 3,
                endIndex: 4,
                operation: 'delete',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('should return the correct array of results', () => {
        const result = (0, editDistance_1.main)('justpfin', 'jusin');
        const expectedResult = [
            {
                errorString: 'tpf',
                startIndex: 3,
                endIndex: 6,
                operation: 'delete',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('should return the correct array of results', () => {
        const result = (0, editDistance_1.main)('jusin', 'justin');
        const expectedResult = [
            {
                errorString: 't',
                startIndex: 3,
                endIndex: 4,
                operation: 'insert',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('should return the correct array of results', () => {
        const result = (0, editDistance_1.main)('jusin', 'justpfin');
        const expectedResult = [
            {
                errorString: 'tpf',
                startIndex: 3,
                endIndex: 6,
                operation: 'insert',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('should return the correct array of results', () => {
        const result = (0, editDistance_1.main)('ab', 'ac');
        const expectedResult = [
            {
                errorString: 'b',
                startIndex: 1,
                endIndex: 2,
                operation: 'replace',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
});
//# sourceMappingURL=index.spec.js.map