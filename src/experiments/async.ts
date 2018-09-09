import * as fs from 'fs';
import * as path from 'path';

async function run () {
    const test = await syncFunction();
    console.log(test);
    const test2 = await asyncFunction();
    console.log(test2);

}

function syncFunction () {
    return 'hello world';
}

function asyncFunction () {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(process.cwd(), '.env'), (err, data) => {
            if (err) reject(err);

            resolve(data.toString());
        })
    })
}


run();