import { TestCollection, AssertionResult, ExecError } from './TestCollection';
import { captureStack } from './helpers';
import * as colors from 'colors';

export default class Test {
    testCollection: TestCollection;
    name: string;
    number: number;
    ok: boolean;
    callback: Function;

    assertionResults: AssertionResult[];
    execErrors: ExecError[];
    assertionNumber: number;

    runThis: boolean;

    constructor (testCollection: TestCollection) {
        this.testCollection = testCollection;
        this.assertionResults = [];
        this.execErrors = [];
        this.assertionNumber = 0;
        this.runThis = true;
    }

    // problmes capturing the stack, and line of fialure in source file should also be added to the object.
    captureExecError (error: Error, info: string) { // , stack: string
        const execError: ExecError = {
            info: info,
            error: error,
            stack: captureStack(), // take argument to decide depth
            line: '',
        }

        this.execErrors.push(execError);
    }

    captureAssertionResult (ok: boolean, message: string, val1: any, val2: any) {
        // Do this at the end, becuase its async
        //if (ok === false) {
            // var lineWithOriginalPosition = getLocationOfLineInTest(stack) // to this at the end of running all tests that needs to run.
        //}
        this.assertionNumber++;

        const assertionResult: AssertionResult = {
            assertionNumber: this.assertionNumber,
            ok: ok,
            message: message,
            value1: val1,
            value2: val2,
            stack: captureStack(),  // take argument to decide depth
            location: '',
        }

        this.testCollection.latestAssertionResult = assertionResult; // not sure if i need

        this.assertionResults.push(assertionResult);
    }

    printResults () {
        if (this.runThis === false) return;
        if (this.ok) console.log(colors.green('Test ' + this.number + ') ' + this.name));
        else console.log(colors.red('Test ' + this.number + ') ' + this.name));

        if (this.execErrors.length) {
            console.log(colors.underline('Exec Error in test\n'));
            this.execErrors.forEach((execError) => {
                console.log(execError.info);
                console.log(execError.error);
            })
        }
        console.group()
        this.assertionResults.forEach((assertionResult) => {
            if (assertionResult.ok) console.log(colors.green('A' + assertionResult.assertionNumber+') ' + assertionResult.message));
            else {
                console.log(colors.red('A' + assertionResult.assertionNumber+') ' + assertionResult.message));
                console.group()
                console.log(colors.green(assertionResult.value1));
                console.log(colors.red(assertionResult.value2));
                console.groupEnd();
            }
        });
        console.groupEnd()
    }

    printFailures () {
        
    }

}
