"use strict";
// const { test, assert } = require('../modules/testing/index');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../modules/testing/index");
module.exports = function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        yield index_1.test('can add two numbers', () => __awaiter(this, void 0, void 0, function* () {
            let result = 5 + 6;
            yield index_1.assert.equal(11, result);
            yield index_1.assert.equal(9, result);
        }));
        yield index_1.test('can add three numbers', () => __awaiter(this, void 0, void 0, function* () {
            let result = 1 + 2 + 3;
            yield index_1.assert.equal(6, result);
            yield index_1.assert.equal(7, result);
        }));
    });
};
//# sourceMappingURL=unit.test.js.map