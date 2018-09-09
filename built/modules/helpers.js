"use strict";
//export {};
// const path = require('path');
//const fs = require('fs');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
// const sourceMap = require('source-map');
const sourceMap = require("source-map");
const colors = require("colors");
const config_1 = require("../config");
/**
 * Recursively get files in the tests-directory matching a regular expression
 * @param directory
 * @returns array of file paths strating from within the tests direcory
 */
function getTestFileNames(regex = '.*') {
    let results = [];
    let testDir = path.join(process.cwd(), config_1.default.testDir);
    traverseFileSystem(testDir, regex, results);
    // filter out .map files
    const finalResults = [];
    results.forEach((file) => {
        if (RegExp(/^.*\.map$/).test(file)) {
            return;
        }
        finalResults.push(file);
    });
    return finalResults;
}
exports.getTestFileNames = getTestFileNames;
/**
 * Traverse the file system under the sourceDirectory and add them to results if matching regex
 * @param sourceDirectory
 * @param results
 * @returns void
 */
function traverseFileSystem(sourceDirectory, regex, results) {
    var files = fs.readdirSync(sourceDirectory);
    for (var i in files) {
        var currentFile = path.join(sourceDirectory, files[i]);
        const match = RegExp(regex).test(currentFile);
        var stats = fs.statSync(currentFile);
        if (stats.isFile() && match) {
            //let tempArr = currentFile.split(/(\\|\/)tests/);
            //currentFile = tempArr[tempArr.length-1]
            results.push(currentFile);
        }
        else if (stats.isDirectory()) {
            traverseFileSystem(currentFile, regex, results);
        }
    }
}
function upDirectory(amount) {
    var dir = __dirname;
    for (let i = 0; i < amount; i++) {
        var slashIndex = dir.lastIndexOf("\\");
        dir = dir.slice(0, slashIndex);
    }
    return dir;
}
exports.upDirectory = upDirectory;
function getLocationOfLineInTest(stack) {
    return __awaiter(this, void 0, void 0, function* () {
        if (stack.length === 0)
            return 'Unable to locate line of fialure in test, because no stack trace was captured.';
        const stackArr = stack.split('\n');
        for (let i = 0; i < stackArr.length; i++) {
            let line = stackArr[i];
            // console.log(line)
            if (/.*\.test\..*/.test(line)) {
                // console.log("found test in line")
                const originalPosition = yield getPositionInSource(line);
                return originalPosition.source + colors.red(` at line ${originalPosition.line} `) + `and col ${originalPosition.column}`;
            }
        }
        return 'Unknown, did not find \"*test*\" in the stack trace.';
    });
}
exports.getLocationOfLineInTest = getLocationOfLineInTest;
function captureStack() {
    let obj = {};
    Error.captureStackTrace(obj);
    return obj.stack;
}
exports.captureStack = captureStack;
function getPositionInSource(location) {
    return __awaiter(this, void 0, void 0, function* () {
        let tempArray = location.split(':');
        let columnNr = parseInt(tempArray.pop());
        let lineNr = parseInt(tempArray.pop());
        let tempArr = tempArray.join(':').split(' ');
        let mapFile = tempArr[tempArr.length - 1] + '.map';
        mapFile = mapFile.replace(/\(|\)/, '');
        const consumer = yield (new sourceMap.SourceMapConsumer(fs.readFileSync(mapFile, "utf-8")));
        return consumer.originalPositionFor({ line: lineNr, column: columnNr });
    });
}
function parseRunOptions() {
    const arr = process.argv.slice(2, process.argv.length);
    const valid = ['path', 'group', 'test'];
    const runOptions = {
        path: '.*',
        group: '',
        test: '.*',
    };
    arr.forEach((element) => {
        if (element.match(/--\w+=.+/)) {
            let [key, val] = element.split('=');
            key = key.slice(2);
            if (valid.indexOf(key) !== -1) {
                runOptions[key] = val;
            }
        }
    });
    return runOptions;
}
exports.parseRunOptions = parseRunOptions;
/*

path.resolve(process.cwd(), '.env')

*/ 
//# sourceMappingURL=helpers.js.map