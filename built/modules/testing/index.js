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
const path = require("path");
const colors = require("colors");
const Results_1 = require("./Results");
const Assert_1 = require("./Assert");
const helpers_1 = require("../helpers");
const regex = process.argv[2];
const testFiles = helpers_1.getTestFileNames(regex);
const results = new Results_1.default();
const assert = new Assert_1.default(results);
exports.assert = assert;
function test(testName, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        assert.currentTestName = testName;
        yield callback(); // could pass in assert here
    });
}
exports.test = test;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < testFiles.length; i++) {
            let fullPath = path.join('..', '..', 'tests', testFiles[i]); // '../../' + folder + '/' + file;
            try {
                const runTest = require(fullPath);
                try {
                    yield runTest();
                }
                catch (error) {
                    console.log(colors.bgRed(`Failed to run test file (${fullPath}), you must wrap your test() function calles within an async function.`));
                    console.log(error);
                }
            }
            catch (error) {
                console.log(colors.bgRed(`Failed to require ${fullPath}`));
            }
        }
        // gather tests (this is what happens in the test function)
        // filter and execute tests
        // print results
    });
}
run().then(() => {
    console.log("Printing results...");
    results.print();
});
//# sourceMappingURL=index.js.map