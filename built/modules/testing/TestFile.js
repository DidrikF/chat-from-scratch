"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const colors = require("colors");
const path = require("path");
const config_1 = require("../../config");
class TestFile {
    constructor() {
        this.describedTests = [];
        this.tests = [];
        this.execErrors = [];
        this.runThis = true;
        this.group = '';
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
        if (this.ok === undefined)
            return console.log('You need to run the tests before being able to print results.');
        if (this.runThis === false)
            return;
        if (this.ok === true)
            console.log('\n' + colors.underline('Results for File: ' + colors.green(path.relative(process.cwd() + '/' + config_1.default.testDir, this.file))));
        else
            console.log('\n' + colors.underline('Results for File: ' + colors.red(path.relative(process.cwd() + '/' + config_1.default.testDir, this.file))));
        if (this.execErrors.length) {
            console.log(colors.underline('Exec Error in file\n'));
            this.execErrors.forEach((execError) => {
                console.log(execError.info);
                console.log(execError.error);
            });
        }
        if (this.describedTests.length) {
            this.describedTests.forEach((describedTests) => {
                // this in the describedTest class
                describedTests.printResults(); // prints both exec errors of block and test results         
            });
        }
        if (this.tests.length) {
            console.log(colors.underline('Results from tests in file'));
            this.tests.forEach((test) => {
                test.printResults();
            });
        }
    }
    printFailures() {
    }
}
exports.default = TestFile;
//# sourceMappingURL=TestFile.js.map