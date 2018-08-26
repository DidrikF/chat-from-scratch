"use strict";
// export {};
// https://nodejs.org/dist/latest-v10.x/docs/api/assert.html
// const Results = require('./Results');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Results_1 = require("./Results");
class Assert {
    constructor(results) {
        this.results = results || new Results_1.default();
        this.currentTestName = "";
    }
    equal(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            if (a === b) {
                yield this.results.add(this.currentTestName, 'OK');
            }
            else {
                yield this.results.add(this.currentTestName, a + ' is Not Equal to ' + b, captureStack());
            }
        });
    }
    value(val) {
        this.value = val;
        return this;
    }
    toBe(val) {
        if (this.value === val) {
            this.results.add(this.currentTestName, 'OK');
        }
        else {
            this.results.add(this.currentTestName, this.value + ' is Not Equal to ' + val);
        }
    }
}
exports.default = Assert;
function captureStack() {
    let obj = {};
    Error.captureStackTrace(obj);
    return obj.stack.split('\n');
}
//# sourceMappingURL=Assert.js.map