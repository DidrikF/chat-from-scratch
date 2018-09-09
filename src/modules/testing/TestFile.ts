import DescribedTests from './DescribedTests';
import Test from './Test';
import { ExecError } from './TestCollection';
import { noop, captureStack } from './helpers';
import * as colors from 'colors';
import * as path from 'path';
import config from '../../config';

export default class TestFile {
    group: string;
    file: string;
    directory: string;
    ok: boolean;
    
    beforeEach: Function;
    afterEach: Function;
    beforeAll: Function;
    afterAll: Function;

    describedTests: DescribedTests[];
    tests: Test[];

    execErrors: ExecError[];

    runThis: boolean;

    constructor () {
        this.describedTests = [];
        this.tests = [];
        this.execErrors = [];
        this.runThis = true;
        this.group = '';

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
        if (this.ok === undefined) return console.log('You need to run the tests before being able to print results.')
        
        if (this.runThis === false) return;

        if (this.ok === true) console.log('\n' + colors.underline('Results for File: ' + colors.green(path.relative(process.cwd() + '/' + config.testDir, this.file))));
        else console.log('\n' + colors.underline('Results for File: ' + colors.red(path.relative(process.cwd() + '/' + config.testDir, this.file))));
        
        if (this.execErrors.length) {
            console.log(colors.underline('Exec Error in file\n'));
            
            this.execErrors.forEach((execError) => {
                console.log(execError.info);
                console.log(execError.error);
            })
        } 

        if (this.describedTests.length) {
            this.describedTests.forEach((describedTests) => {
                // this in the describedTest class
                describedTests.printResults(); // prints both exec errors of block and test results         
            })
        }

        if (this.tests.length) {
            console.log(colors.underline('Results from tests in file'))
            this.tests.forEach((test) => {
                test.printResults();
            })
        }
    }

    printFailures () {

    }

}