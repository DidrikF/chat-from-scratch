//export {};
// const path = require('path');
//const fs = require('fs');

import * as fs from 'fs';
import * as path from 'path';
// const sourceMap = require('source-map');
import * as sourceMap from 'source-map';
import * as colors from 'colors';

/**
 * Recursively get files in the tests-directory matching a regular expression
 * @param directory 
 * @returns array of file paths strating from within the tests direcory
 */
export function getTestFileNames (regex: string): string[] {
    let baseDir = upDirectory(1); // can this be more dynamic
    let testDir = path.join(baseDir, 'tests');
    let results: string[] = [];
    traverseFileSystem(testDir, regex, results);
    return results;
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
            let tempArr = currentFile.split(/(\\|\/)tests/);
            currentFile = tempArr[tempArr.length-1]
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

export async function getLocationOfLineInTest (stack: string[]): Promise<string> {

    for (let i = 0; i < stack.length; i++) {
        let line: string = stack[i];
        // console.log(line)
        if (/.*\.test\..*/.test(line)) {
            // console.log("fond test in line")
            const originalPosition = await getPositionInSource(line)
            return originalPosition.source + colors.red(` at line ${originalPosition.line} `) + `and col ${originalPosition.column}`;
        }
    }
    return 'Unknown, did not find \"*test*\" in the stack trace.';
}

async function getPositionInSource (location: string) {
    let tempArray = location.split(':');
    let columnNr = parseInt(tempArray.pop()); 
    let lineNr = parseInt(tempArray.pop());
    // console.log(columnNr, lineNr);

    let tempArr = tempArray.join(':').split(' ');
    let mapFile = tempArr[tempArr.length-1] + '.map';
    // console.log(mapFile)
    const consumer = await (new sourceMap.SourceMapConsumer(fs.readFileSync(mapFile, "utf-8")))
    return consumer.originalPositionFor({line: lineNr, column: columnNr});
}
