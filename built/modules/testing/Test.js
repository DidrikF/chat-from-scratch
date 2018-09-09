"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const colors = require("colors");
class Test {
    constructor(testCollection) {
        this.testCollection = testCollection;
        this.assertionResults = [];
        this.execErrors = [];
        this.assertionNumber = 0;
        this.runThis = true;
    }
    // problmes capturing the stack, and line of fialure in source file should also be added to the object.
    captureExecError(error, info) {
        const execError = {
            info: info,
            error: error,
            stack: helpers_1.captureStack(),
            line: '',
        };
        this.execErrors.push(execError);
    }
    captureAssertionResult(ok, message, val1, val2) {
        // Do this at the end, becuase its async
        //if (ok === false) {
        // var lineWithOriginalPosition = getLocationOfLineInTest(stack) // to this at the end of running all tests that needs to run.
        //}
        this.assertionNumber++;
        const assertionResult = {
            assertionNumber: this.assertionNumber,
            ok: ok,
            message: message,
            value1: val1,
            value2: val2,
            stack: helpers_1.captureStack(),
            location: '',
        };
        this.testCollection.latestAssertionResult = assertionResult; // not sure if i need
        this.assertionResults.push(assertionResult);
    }
    printResults() {
        if (this.runThis === false)
            return;
        if (this.ok)
            console.log(colors.green('Test ' + this.number + ') ' + this.name));
        else
            console.log(colors.red('Test ' + this.number + ') ' + this.name));
        if (this.execErrors.length) {
            console.log(colors.underline('Exec Error in test\n'));
            this.execErrors.forEach((execError) => {
                console.log(execError.info);
                console.log(execError.error);
            });
        }
        console.group();
        this.assertionResults.forEach((assertionResult) => {
            if (assertionResult.ok)
                console.log(colors.green('A' + assertionResult.assertionNumber + ') ' + assertionResult.message));
            else {
                console.log(colors.red('A' + assertionResult.assertionNumber + ') ' + assertionResult.message));
                console.group();
                console.log(colors.green(assertionResult.value1));
                console.log(colors.red(assertionResult.value2));
                console.groupEnd();
            }
        });
        console.groupEnd();
    }
    printFailures() {
    }
}
exports.default = Test;
//# sourceMappingURL=Test.js.map