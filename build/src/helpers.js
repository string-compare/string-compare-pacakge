"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_error_obj = void 0;
// This is the 'create' factory that creates fully operational result objects
function create_error_obj({ char, index, indexGen, indexExp, operation, }) {
    return {
        char,
        index,
        indexGen,
        indexExp,
        operation,
    };
}
exports.create_error_obj = create_error_obj;
//# sourceMappingURL=helpers.js.map