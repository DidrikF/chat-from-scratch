import * as path from 'path';
import * as colors from 'colors';
import Results from './Results';
import Assert from './Assert';
import { getTestFileNames } from '../helpers';


const regex = process.argv[2];
const testFiles = getTestFileNames(regex);

const results = new Results();
const assert = new Assert(results);

export async function test (testName :string, callback :Function) { // why invoke the function? why not just gather it for later execution
    assert.currentTestName = testName;
    await callback(); // could pass in assert here
}

export { assert };



async function run () {
    for (let i = 0; i < testFiles.length; i++) {
        let fullPath = path.join('..', '..', 'tests', testFiles[i]); // '../../' + folder + '/' + file;

        try {
            const runTest = require(fullPath);
            try {
                await runTest()
            } catch (error) {
                console.log(colors.bgRed(`Failed to run test file (${fullPath}), you must wrap your test() function calles within an async function.`))
                console.log(error);
            }
            
        } catch(error) {
            console.log(colors.bgRed(`Failed to require ${fullPath}`))
        }
    }

    // gather tests (this is what happens in the test function)

    // filter and execute tests

    // print results

}

run().then(() => {
    console.log("Printing results...")
    results.print();
});
