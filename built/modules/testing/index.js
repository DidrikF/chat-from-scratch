"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const fs = require("fs");
const Assert_1 = require("./Assert");
const helpers_1 = require("./helpers");
const TestCollection_1 = require("./TestCollection");
const Test_1 = require("./Test");
const DescribedTests_1 = require("./DescribedTests");
const runOptions = helpers_1.parseRunOptions();
if (runOptions.file !== '' && runOptions.line > -1) {
    // THIS WORKS FINE (on windows...)
    const matches = runOptions.file.match(/.*[\/|\\]src[\/|\\]tests[\/|\\](.*)/);
    if (matches && matches.length > 1) {
        const pathToTestFileRelativeToTestDir = matches[1].replace('.ts', '.js').replace(/\\/g, '\\\\');
        runOptions.path = '.*' + pathToTestFileRelativeToTestDir;
    }
    // THIS PART NEEDS WORK
    try {
        var file = fs.readFileSync(runOptions.file).toString('UTF-8');
    }
    catch (err) {
        console.log('Failed to read the file the cursor is in.');
        console.log(err);
        process.exit(0);
    }
    const arr = file.split('\n');
    // NEED TO ACCOUNT FOR LEVEL OF INDENTATION, or {} (or not)
    for (let i = 1; i <= runOptions.line; i++) {
        const line = arr[runOptions.line - i];
        if (RegExp(/.*test *\(.*/).test(line)) {
            const matches = line.match(/.*[\'|\"]([\w ]+)[\\'|\\"].*/);
            if (matches !== null) {
                runOptions.test = matches[1];
                break;
            }
        }
        if (RegExp(/.*describe *\(.*/).test(line)) {
            const matches = line.match(/.*[\'|\"]([\w ]+)[\\'|\\"].*/);
            if (matches !== null) {
                runOptions.describe = matches[1];
                break;
            }
        }
    }
}
console.log('Run Options: ' + JSON.stringify(runOptions) + '\n');
const testCollection = new TestCollection_1.TestCollection(runOptions);
const assert = new Assert_1.default(testCollection);
global.expect = function expect(value) {
    assert.value = value;
    return assert;
};
global.log = function log(value) {
    testCollection.log.push(value);
};
// Both are within the context of a file.
global.test = function test(testName, callback) {
    // need access to TestCollection
    // test collection has been created
    // testFile has been created and set on the TestCollection
    // Create new test
    const test = new Test_1.default(testCollection); // does it really need the TestCollection, I dont think so...
    test.name = testName;
    test.number = testCollection.testNumberState;
    test.callback = callback;
    // if within a describe, register the test on the DescribedTest
    // if not within a describe, register the test directly on the TestFile
    if (testCollection.currentDescribedTests !== null) {
        testCollection.currentDescribedTests.tests.push(test);
    }
    else {
        testCollection.currentTestFile.tests.push(test);
    }
    // increment global test number.
    testCollection.testNumberState++;
};
// sets up a new DescribedTests object and runs callback to register tests and other callbacks within.
global.describe = function describe(description, callback) {
    const describedTests = new DescribedTests_1.default();
    testCollection.currentDescribedTests = describedTests;
    testCollection.currentTestFile.describedTests.push(describedTests);
    describedTests.description = description;
    describedTests.callback = callback;
    // register hooks and tests
    callback();
    testCollection.currentDescribedTests = null;
};
// All of these methods might be in the context of both a file and a describe.
// Callback must return a promise (be async)
global.beforeEach = function beforeEach(callback) {
    if (testCollection.currentDescribedTests !== null) {
        testCollection.currentDescribedTests.beforeEach = callback;
    }
    else {
        testCollection.currentTestFile.beforeEach = callback;
    }
};
global.afterEach = function afterEach(callback) {
    if (testCollection.currentDescribedTests !== null) {
        testCollection.currentDescribedTests.afterEach = callback;
    }
    else {
        testCollection.currentTestFile.afterEach = callback;
    }
};
global.beforeAll = function beforeAll(callback) {
    if (testCollection.currentDescribedTests !== null) {
        testCollection.currentDescribedTests.beforeAll = callback;
    }
    else {
        testCollection.currentTestFile.beforeAll = callback;
    }
};
global.afterAll = function afterAll(callback) {
    if (testCollection.currentDescribedTests !== null) {
        testCollection.currentDescribedTests.afterAll = callback;
    }
    else {
        testCollection.currentTestFile.afterAll = callback;
    }
};
testCollection.collect()
    .then(() => {
    testCollection.captureWhatToRun();
    /*
    testCollection.testFiles.forEach((testFile) => {
        console.log(testFile.runThis);
        testFile.tests.forEach((test) => {
            console.log(test.runThis)
        })
    })
    */
    testCollection.run()
        .then((testCollection) => {
        console.log('\n');
        testCollection.printResults();
        testCollection.printLog();
    }).catch((fileDescribeTest) => {
        // If we have abortOnExecFailure or abortOnAssertionFailure set to true, we dont know what object we get or what went wrong...
        console.log(fileDescribeTest);
    });
}).catch((err) => {
    console.log(colors.red('Failed during collection of tests'));
    console.log(err);
});
//# sourceMappingURL=index.js.map