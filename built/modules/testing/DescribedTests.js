"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const colors = require("colors");
class DescribedTests {
    constructor() {
        this.tests = [];
        this.execErrors = [];
        this.runThis = true;
        this.beforeEach = helpers_1.noop;
        this.afterEach = helpers_1.noop;
        this.beforeAll = helpers_1.noop;
        this.afterAll = helpers_1.noop;
    }
    captureExecError(error, info) {
        const execError = {
            info: info,
            error: error,
            stack: helpers_1.captureStack(),
            line: '',
        };
        this.execErrors.push(execError);
    }
    printResults() {
        if (this.runThis === false)
            return;
        if (this.ok === true)
            console.log(colors.underline('Block: ' + colors.green(this.description)));
        else
            console.log(colors.underline('Block: ' + colors.red(this.description)));
        if (this.execErrors.length) {
            console.log(colors.underline('Exec Error in block\n'));
            this.execErrors.forEach((execError) => {
                console.log(execError.info);
                console.log(execError.error);
            });
        }
        if (this.tests.length) {
            if (this.execErrors.length)
                console.log(colors.underline('Test results from block'));
            this.tests.forEach((test) => {
                test.printResults();
            });
        }
    }
    printFailures() {
    }
}
exports.default = DescribedTests;
//# sourceMappingURL=DescribedTests.js.map