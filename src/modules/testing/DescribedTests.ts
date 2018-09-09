import { ExecError } from './TestCollection';
import Test from './Test';
import { noop, captureStack } from './helpers';
import * as colors from 'colors';

export default class DescribedTests {
    description: string;
    callback: Function;
    ok: boolean;

    beforeEach: Function;
    afterEach: Function;
    beforeAll: Function;
    afterAll: Function;
    tests: Test[];

    execErrors: ExecError[];

    runThis: boolean;

    constructor () {
        this.tests = [];
        this.execErrors = [];
        this.runThis = true;

        this.beforeEach = noop;
        this.afterEach = noop;
        this.beforeAll = noop;
        this.afterAll = noop;
    }

    captureExecError (error: Error, info: string) {
        const execError: ExecError = {
            info: info,
            error: error,
            stack: captureStack(),
            line: '',
        }

        this.execErrors.push(execError);
    }

    printResults () {
        if (this.runThis === false) return;

        if (this.ok === true) console.log(colors.underline('Block: ' + colors.green(this.description)));
        else console.log(colors.underline('Block: ' + colors.red(this.description)));
        
        if (this.execErrors.length) {
            console.log(colors.underline('Exec Error in block\n'));
            this.execErrors.forEach((execError) => {
                console.log(execError.info);
                console.log(execError.error);
            })
        }
        
        if (this.tests.length) {
            if (this.execErrors.length) console.log(colors.underline('Test results from block'));
            this.tests.forEach((test) => {
                test.printResults();
            });
        }

    }

    printFailures () {
        
    }

}