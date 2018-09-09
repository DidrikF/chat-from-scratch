//export {};
// const path = require('path');
//const fs = require('fs');

import * as fs from 'fs';
import * as path from 'path';
// const sourceMap = require('source-map');
import * as sourceMap from 'source-map';
import * as colors from 'colors';
import config from '../../config';

/**
 * Recursively get files in the tests-directory matching a regular expression
 * @param directory 
 * @returns array of file paths strating from within the tests direcory
 */
export function getTestFileNames (regex: string = '.*'): string[] {
    let results: string[] = [];

    let testDir = path.join(process.cwd(), config.testDir);

    traverseFileSystem(testDir, regex, results);

    // filter out .map files
    const finalResults: string[] = [];

    results.forEach((file: string) => {
        if (RegExp(/^.*\.map$/).test(file)) {
            return;
        }
        finalResults.push(file);
    })
    return finalResults;
}

/**
 * Traverse the file system under the sourceDirectory and add them to results if matching regex
 * @param sourceDirectory
 * @param results
 * @returns void
 */
function traverseFileSystem (sourceDirectory: string, regex: string, results: string[]): void {
    var files = fs.readdirSync(sourceDirectory);
    for (var i in files) {
        var currentFile = path.join(sourceDirectory, files[i]);
        
        const match = RegExp(regex).test(currentFile)
        
        var stats = fs.statSync(currentFile);
        if (stats.isFile() && match) {
            //let tempArr = currentFile.split(/(\\|\/)tests/);
            //currentFile = tempArr[tempArr.length-1]
            results.push(currentFile)
        } else if (stats.isDirectory()) {
            traverseFileSystem(currentFile, regex, results);
        }
    }
}
  

export function upDirectory(amount :number) :string {
    var dir = __dirname;
    for (let i = 0; i < amount; i++) {
        var slashIndex = dir.lastIndexOf("\\");
        dir = dir.slice(0, slashIndex);
    }
    return dir;
}

export async function getLocationOfLineInTest (stack: string): Promise<string> {
    if (stack.length === 0) return 'Unable to locate line of fialure in test, because no stack trace was captured.'
    const stackArr = stack.split('\n');
    for (let i = 0; i < stackArr.length; i++) {
        let line: string = stackArr[i];
        // console.log(line)
        if (/.*\.test\..*/.test(line)) {
            // console.log("found test in line")
            const originalPosition = await getPositionInSource(line)
            return originalPosition.source + colors.red(` at line ${originalPosition.line} `) + `and col ${originalPosition.column}`;
        }
    }
    return 'Unknown, did not find \"*test*\" in the stack trace.';
}



export function captureStack (): string{
    let obj: {stack?: any} = {};
    Error.captureStackTrace(obj);
    return obj.stack;
}

async function getPositionInSource (location: string) {
    let tempArray = location.split(':');
    let columnNr = parseInt(tempArray.pop()); 
    let lineNr = parseInt(tempArray.pop());

    let tempArr = tempArray.join(':').split(' ');
    let mapFile = tempArr[tempArr.length-1] + '.map';
    mapFile = mapFile.replace(/\(|\)/, '');
    
    const consumer = await (new sourceMap.SourceMapConsumer(fs.readFileSync(mapFile, "utf-8")))
    return consumer.originalPositionFor({line: lineNr, column: columnNr});
}


export function parseRunOptions() {
    const arr = process.argv.slice(2, process.argv.length);
    const runOptions: any = { // type: RunOptions
        path: '.*',
        group: '',
        test: '.*',
        describe: '.*',
        file: '',
        line: -1,
    };
    arr.forEach((element) => {
        if (element.match(/--\w+=.+/)) {
            let [key, val] = element.split('=');
            key = key.slice(2);
            if (Object.keys(runOptions).indexOf(key) !== -1) {
                if (key === 'line') {
                    runOptions[key] = parseInt(val);
                    return;
                }
                runOptions[key] = val;
            }
        }
    })

    return runOptions;
}


export function noop () {}


/*

path.resolve(process.cwd(), '.env')

*/