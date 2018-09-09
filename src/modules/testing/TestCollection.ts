import { getLocationOfLineInTest, captureStack, getTestFileNames, noop } from './helpers';
import * as fs from 'fs';
import * as path from 'path';
import * as colors from 'colors';
import * as logSymboles from 'log-symbols';
import config from '../../config';
import TestFile from './TestFile';
import DescribedTests from './DescribedTests';
import Test from './Test';

export type AssertionResult = {
    assertionNumber: number, 
    ok: boolean, 
    message: string, 
    value1: any,
    value2: any,
    location: string, 
    stack: string, 
};

export type ExecError = {
    info: string,
    error: Error, 
    stack: string,
    line: string,
};

export type RunOptions = {path: string, test: string, describe: string, group: string, file: string, line: number};


export class TestCollection {
    testFiles: TestFile[];
    filePaths: string[];

    currentTestFile: TestFile;
    currentDescribedTests: DescribedTests;
    runningTest: Test;

    testNumberState: number;

    latestAssertionResult: AssertionResult; // not using atm

    log: any[];

    runOptions: RunOptions;

    constructor (runOptions: RunOptions) { // the files here, has already been filtered based on --path regex option.
        this.testFiles = [];
        this.runOptions = runOptions;

        this.currentDescribedTests = null;
        this.currentTestFile = null;
        this.runningTest = null;
        this.testNumberState = 1;

        this.log = [];
    }

    collect () {
        this.filePaths = getTestFileNames(this.runOptions.path);
        //console.log(this.filePaths)
        // gather tests
        for (let i = 0; i < this.filePaths.length; i++) {
            let from: string = __dirname;
            let to: string = this.filePaths[i];
            let pathToTestFile: string = path.relative(from, to);

            // Create TestFile object and set paramaters
            const testFile = new TestFile()
            testFile.file = this.filePaths[i];
            testFile.group = this.identifyGroup(this.filePaths[i]) || '';
            testFile.directory = this.filePaths[i].match(/(.*)(\\|\/)[\w\.]+\.js/)[1];


            this.testFiles.push(testFile);
            this.currentTestFile = testFile;

            try {
                // Executing test() and describe functions needs to create appropriate objects 
                require(pathToTestFile); // executes test() functions, registering the tests with the test-runner.
            } catch(error) {
                // could it be that part of the test-file executes succcessfully, while the rest does not?
                console.log(colors.bgRed(`Failed to require ${pathToTestFile}`))
                return Promise.reject(error);
            }

            this.currentTestFile = null; // for expressiveness
        }

        return Promise.resolve(null);

    }

    identifyGroup (pathToTestFile: string) {
        const file = fs.readFileSync(pathToTestFile).toString();
        const regex = /\/\*\* ?group \w+ ?\*\//
        const matches = regex.exec(file);
        if (matches && matches.length) {
            let groupDeclaration = matches[0];
            let group = groupDeclaration.match(/\/\*\* ?group (\w+) ?\*\//)[1];
            return group;
        }

        return undefined;
    }

    /*
    * Need to implement dealing with errors, callstacks, results
    */

    // does file and/or describedTests have tests to run? If so, run the hooks at each level, otherwise skip to the next file/block
    // this would allow one set of code to run one or many tests based on regex
    captureWhatToRun () {
        // File-level is the first level of filtration (complete), --path indicates to run the file

        // Group level is the next levle of filtration, --group flag further filters files
        if (this.runOptions.group !== '') {
            for (let i = 0; i < this.testFiles.length; i++) {
                const testFile = this.testFiles[i];
                if (testFile.group !== this.runOptions.group) { // group is exact string match! not regex
                    testFile.runThis = false; // filter it out.
                }
            }
        }

        // DescribedTests is the next level of filtration
        /*
        if (this.runOptions.describe !== '.*') {
            for (let i = 0; i < this.testFiles.length; i++) {
                const testFile = this.testFiles[i];
                if (testFile.runThis === false) { // honor eariler filtration.
                    continue;
                }
                for (let j = 0; j < testFile.describedTests.length; j++) {
                    const describedTests = testFile.describedTests[j];
                    if () {
                        describedTests.runThis = true;

                    } else {
                        describedTests.runThis = false;
                    }
                }

            }
        }
        */

        // Test level is the last level of filtration
        if (this.runOptions.test !== '.*' || this.runOptions.describe !== '.*') {
            // find tests that does not match and 
            for (let i = 0; i < this.testFiles.length; i++) {
                const testFile = this.testFiles[i];
                if (testFile.runThis === false) { // honor eariler filtration.
                    continue;
                }
                let numberOfTestsToRunInTestFile = 0;

                for (let j = 0; j < testFile.describedTests.length; j++) {
                    const describedTests = testFile.describedTests[j];

                    // describedTests.runThis = true;
                    let numberOfTestsToRunInDescribedTests = 0;
                    for (let k = 0; k < describedTests.tests.length; k++) {
                        const test = describedTests.tests[k];
                        if (RegExp(this.runOptions.test).test(test.name) && RegExp(this.runOptions.describe).test(describedTests.description)) {
                            //test is a match, we want to run it
                            test.runThis = true;
                            numberOfTestsToRunInDescribedTests++;
                            numberOfTestsToRunInTestFile++;
                        } else {
                            test.runThis =false;
                        }
                    }
                    if (numberOfTestsToRunInDescribedTests > 0) {
                        describedTests.runThis = true;
                    } else {
                        describedTests.runThis = false;
                    }
                }
                for (let j = 0; j < testFile.tests.length; j++) {
                    const test = testFile.tests[j];
                    if (RegExp(this.runOptions.test).test(test.name) && this.runOptions.describe === '.*') {
                        test.runThis = true;
                        numberOfTestsToRunInTestFile++;
                    } else {
                        test.runThis = false;
                    }
                }


                if (numberOfTestsToRunInTestFile > 0) {
                    testFile.runThis = true;
                } else {
                    testFile.runThis = false;
                }

            }
        }
    }


    async run () {
        // run file by file
        //___START_OF_FILES_LOOP___
        for (let i = 0; i < this.testFiles.length; i++) {
            const testFile = this.testFiles[i];
            testFile.ok = false;

            if (testFile.runThis === false) continue;

            testFile.ok = true;
            // run file beforeAll
            try {
                await testFile.beforeAll();
            } catch (err) {
                testFile.captureExecError(err, 'Error thrown in beforeAll-hook in file with path: ' + testFile.file);
                testFile.ok = false;
                if (config.abortTestingOnExecFailure) {
                    return Promise.reject(testFile);
                }
            }
    
            //___START_OF_DESCRIBED_TESTS_SECTION___
            for (let i = 0; i < testFile.describedTests.length; i++) {
                const describedTests = testFile.describedTests[i];
                if (describedTests.runThis === false) continue;

                describedTests.ok = true;

                try {
                    await describedTests.beforeAll()
                } catch (err) {
                    describedTests.captureExecError(err, 'Error thrown in beforeAll-hook in block with description: ' + describedTests.description);
                    testFile.ok = false;
                    describedTests.ok = false;

                    if (config.abortTestingOnExecFailure) {
                        return Promise.reject(describedTests);
                    }
                }

                // run tests registered on DescribedTests object
                for (let i = 0; i < describedTests.tests.length; i++) {
                    const test = describedTests.tests[i];
                    if (test.runThis === false) continue;

                    try {
                        await testFile.beforeEach();
                    } catch (err) { // associated with File
                        testFile.captureExecError(err, 'Error thrown in beforeAll-hook in file with path: ' + testFile.file);
                        testFile.ok = false;

                        if (config.abortTestingOnExecFailure) {
                            return Promise.reject(testFile);
                        }
                    }
                    
                    try {
                        await describedTests.beforeEach();
                    } catch (err) { // associated with describedTests
                        describedTests.beforeEach(err, 'Error thrown in afterEach-hook in block with description: ' + describedTests.description);
                        testFile.ok = false;
                        describedTests.ok = false;

                        if (config.abortTestingOnExecFailure) {
                            return Promise.reject(describedTests);
                        }
                    }
                    
                    // run test
                    try {
                        this.runningTest = test;
                        await test.callback();

                        // a test is successfull if all assertions are successfull and the test did not fail during execution.
                        const nr_of_assertions_in_last_test = test.assertionNumber
                        let testOK = true;
                        for (let i = 0; i < nr_of_assertions_in_last_test; i++) {
                            let assertionResult = test.assertionResults[test.assertionResults.length-1 - i]
                            if (assertionResult.ok === false) {
                                testOK = false
                                break;
                            }
                        }

                        // capture test ok status, and print its result
                        if (testOK === true) {
                            test.ok = true;
                            process.stdout.write(colors.green(logSymboles.success)+' '); // needs to be sync
                        } else {
                            test.ok = false;
                            describedTests.ok = false;
                            testFile.ok = false;
                            process.stdout.write(colors.red(logSymboles.error)+' '); // needs to be sync

                            if (config.abortTestingOnAssertionFailure) {
                                return Promise.reject(test);
                            }
                        }

                    } catch (err) {
                        // there was an error running the test, even if all assertion were ok, report the test as an error
                        test.ok = false;
                        describedTests.ok = false;
                        testFile.ok = false;
                        test.captureExecError(err, 'Error thrown when executing test by name: ' + test.name);
                        process.stdout.write(colors.red(logSymboles.error)+' '); // needs to be sync

                        if (config.abortTestingOnExecFailure) {
                            return Promise.reject(test);
                        }
                    }

                    try {
                        await describedTests.afterEach();
                    } catch (err) { // associated with describedTests
                        describedTests.captureExecError(err, 'Error thrown in afterEach-hook in block with description: ' + describedTests.description);
                        describedTests.ok = false;
                        testFile.ok = false;
                        if (config.abortTestingOnExecFailure) {
                            return Promise.reject(describedTests);
                        }
                    }
                    
                    try {
                        await testFile.afterEach();
                    } catch (err) { // associated with File
                        testFile.captureExecError(err, 'Error thrown in afterEach-hook in file with path: ' + testFile.file);
                        testFile.ok = false;

                        if (config.abortTestingOnExecFailure) {
                            return Promise.reject(testFile);
                        }
                    }
                }

                try {
                    await describedTests.afterAll();
                } catch (err) { // associated with describedTests
                    describedTests.captureExecError(err, 'Error thrown in afterAll-hook in block with description: ' + describedTests.description);
                    describedTests.ok = false;
                    testFile.ok = false;

                    if (config.abortTestingOnExecFailure) {
                        return Promise.reject(describedTests);
                    }
                }
            } 
            //___END_OF_DESCRIBED_TESTS_SECTION___



            //___START_OF_TESTS_IN_FILE___
            for (let i = 0; i < testFile.tests.length; i++) {
                const test = testFile.tests[i];
                if (test.runThis === false) continue;

                try {
                    await testFile.beforeEach() // associated with file
                } catch (err) {
                    const stack = captureStack();
                    testFile.captureExecError(err, 'Error thrown in beforeEach-hook in file with path: ' + testFile.file);
                    testFile.ok = false;

                    if (config.abortTestingOnExecFailure) {
                        return Promise.reject(testFile);
                    }
                }


                try {
                    this.runningTest = test;
                    await test.callback(); 

                    // a test is successfull if all assertions are successfull and the test did not fail during execution.
                    const nr_of_assertions_in_last_test = test.assertionNumber
                    let testOK = true;
                    for (let i = 0; i < nr_of_assertions_in_last_test; i++) {
                        let assertionResult = test.assertionResults[test.assertionResults.length-1 - i]
                        if (assertionResult.ok === false) {
                            testOK = false
                            break;
                        }
                    }

                    // capture test ok status, and print its result
                    if (testOK === true) {
                        test.ok = true;
                        process.stdout.write(colors.green(logSymboles.success)+' '); // needs to be sync
                    } else {
                        test.ok = false;
                        testFile.ok = false;

                        process.stdout.write(colors.red(logSymboles.error)+' '); // needs to be sync

                        if (config.abortTestingOnAssertionFailure === true) {
                            return Promise.reject(test);
                        }
                    }

                } catch (err) {
                    // there was an error running the test, even if all assertion were ok, report the test as an error
                    test.ok = false;
                    testFile.ok = false;
                    test.captureExecError(err, 'Error thrown when executing test by name: ' + test.name);
                    process.stdout.write(colors.red(logSymboles.error)+' '); // needs to be sync
                    
                    if (config.abortTestingOnExecFailure) {
                        return Promise.reject(test);
                    }
                }

                try {
                    await testFile.afterEach() // associated with file
                } catch (err) {
                    testFile.captureExecError(err, 'Error thrown in afterEach-hook in file with path: ' + testFile.file);
                    testFile.ok = false;

                    if (config.abortTestingOnExecFailure) {
                        return Promise.reject(testFile);
                    }
                }
            }
            //___END_OF_TESTS_IN_FILE___

            try {
                await testFile.afterAll(); // associated with file
            } catch (err) {
                testFile.captureExecError(err, 'Error thrown in afterAll-hook in file with path: ' + testFile.file);
                testFile.ok = false;

                if (config.abortTestingOnExecFailure) {
                    return Promise.reject(testFile);
                }
            }
        }
        //___END_OF_FILES_LOOP___

        return Promise.resolve(this);
    }


    printResults () { // maybe each level (File, Describe, Test) each know how to print their own errors
        this.testFiles.forEach((file => {
            file.printResults();
        }))
    }

    printFailures () {
        this.testFiles.forEach((file) => {
            file.printFailures();
        })
    }

    printLog () {
        console.log('\n')
        this.log.forEach((value) => {
            console.log(value);
        })
        console.log('\n')
    }

}


/*

const results = [
    {
        directory: 'dir/dir',
        group: '',
        testFile: 'dir/dir/file.js',
        beforeEach: () => {},
        afterEach: () => {},
        beforeAll: () => {},
        afterAll: () => {},
        described: [
            {
                title: 'describe section name',
                beforeEach: () => {},
                afterEach: () => {},
                beforeAll: () => {},
                afterAll: () => {},
                tests: [
                    {
                        function: () => {},
                        ok: false,
                        name: 'test name',
                        number: 2,
                        assertions: [
                            {
                                assertionNumber: number, 
                                ok: boolean, 
                                message: string, 
                                location: string, 
                                stack: string, 
                                file: string
                            },
                        ]
                    }
                ]
            }

        ],
        tests: [
            {
                function: () => {},
                ok: false,
                name: 'test name',
                number: 2,
                assertions: [
                    {
                        assertionNumber: number, 
                        ok: boolean, 
                        message: string, 
                        location: string, 
                        stack: string, 
                        file: string
                    },
                ]
            }
        ]
    }
]

*/