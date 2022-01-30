"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('Dp', () => {
    it('should return the result object for the difference between strings', () => {
        const dp = new index_1.Dp('abc', 'abcd');
        expect(dp.editDistance()).toEqual({
            char: 'd',
            index: 3,
            context: '',
            cost: 1,
            operation: 'delete',
        });
    });
});
//# sourceMappingURL=index.spec.js.map