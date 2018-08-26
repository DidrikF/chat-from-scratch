"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const colors = require('colors');
class Results {
    constructor() {
        this.results = [];
        this.number = 0;
        this.assertionNumber = 1;
    }
    print() {
        let prevTest = this.results.length > 0 ? this.results[this.results.length - 1].test : '';
        this.results.forEach((result) => {
            if (prevTest !== result.test) {
                console.log(colors.bgBlue.underline(result.number + ') ' + result.test));
            }
            if (result.message === 'OK') {
                console.log(colors.green('   ' + result.assertionNumber + ') ' + result.message));
            }
            else {
                console.log(colors.red('   ' + result.assertionNumber + ') ' + result.message));
                console.log('    ' + result.location);
            }
            prevTest = result.test;
        });
    }
    add(testName, message, stack = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let prevTestName = this.results.length > 0 ? this.results[this.results.length - 1].test : '';
            if (prevTestName !== testName) {
                this.number++;
                this.assertionNumber = 1;
            }
            const lineWithOriginalPosition = yield helpers_1.getLocationOfLineInTest(stack);
            this.results.push({
                number: this.number,
                assertionNumber: this.assertionNumber,
                test: testName,
                message: message,
                location: lineWithOriginalPosition,
                file: "",
            });
            this.assertionNumber++;
        });
    }
}
exports.default = Results;
//# sourceMappingURL=Results.js.map