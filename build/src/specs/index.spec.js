"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editDistance_1 = require("../editDistance");
describe('edit_distance', () => {
    it('case: 1', () => {
        const result = (0, editDistance_1.edit_distance)('justin', 'jusin');
        const expectedResult = [
            {
                errorString: 't',
                startIndex: 3,
                endIndex: 4,
                expIndices: [2],
                genIndices: [3],
                operation: 'delete',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 2', () => {
        const result = (0, editDistance_1.edit_distance)('justpfin', 'jusin');
        const expectedResult = [
            {
                errorString: 'tpf',
                startIndex: 3,
                endIndex: 6,
                expIndices: [2, 2, 2],
                genIndices: [3, 4, 5],
                operation: 'delete',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 3', () => {
        const result = (0, editDistance_1.edit_distance)('jusin', 'justin');
        const expectedResult = [
            {
                errorString: 't',
                startIndex: 3,
                endIndex: 4,
                expIndices: [3],
                genIndices: [2],
                operation: 'insert',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 4', () => {
        const result = (0, editDistance_1.edit_distance)('jusin', 'justpfin');
        const expectedResult = [
            {
                errorString: 'tpf',
                startIndex: 3,
                endIndex: 6,
                genIndices: [2, 2, 2],
                expIndices: [3, 4, 5],
                operation: 'insert',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 5', () => {
        const result = (0, editDistance_1.edit_distance)('ab', 'ac');
        const expectedResult = [
            {
                errorString: 'c',
                startIndex: 1,
                endIndex: 2,
                genIndices: [1],
                expIndices: [1],
                operation: 'replace',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 6', () => {
        const result = (0, editDistance_1.edit_distance)('abf', 'acq');
        const expectedResult = [
            {
                errorString: 'cq',
                startIndex: 1,
                endIndex: 3,
                genIndices: [1, 2],
                expIndices: [1, 2],
                operation: 'replace',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 7', () => {
        const result = (0, editDistance_1.edit_distance)('the dog and the bird', 'the cat and the bird');
        const expectedResult = [
            {
                errorString: 'cat',
                startIndex: 4,
                endIndex: 7,
                genIndices: [4, 5, 6],
                expIndices: [4, 5, 6],
                operation: 'replace',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 8', () => {
        const result = (0, editDistance_1.edit_distance)('the dog and the bird', 'the and the bird');
        const expectedResult = [
            {
                errorString: ' dog',
                startIndex: 3,
                endIndex: 7,
                genIndices: [3, 4, 5, 6],
                expIndices: [2, 2, 2, 2],
                operation: 'delete',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
    it('case: 9', () => {
        const result = (0, editDistance_1.edit_distance)('the dog and the bird', 'the and the big bird');
        const expectedResult = [
            {
                errorString: ' dog',
                startIndex: 3,
                endIndex: 7,
                genIndices: [3, 4, 5, 6],
                expIndices: [2, 2, 2, 2],
                operation: 'delete',
            },
            {
                errorString: ' big',
                startIndex: 11,
                endIndex: 15,
                genIndices: [14, 14, 14, 14],
                expIndices: [11, 12, 13, 14],
                operation: 'insert',
            },
        ];
        expect(result).toEqual(expectedResult);
    });
});
//# sourceMappingURL=index.spec.js.map