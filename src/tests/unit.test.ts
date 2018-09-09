// import { expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '../modules/testing/index';
import * as fs from 'fs';

/** group integration */

beforeEach(async () => {
    log('beforeEach in file');
    const files = await getFiles();
    log(files);
});

afterEach(() => {
    log('afterEach in file');
})

beforeAll(() => {
    log('beforeAll in file');
})

afterAll(() => {
    log('afterAll in file');
});


describe('a description of a collection of tests', () => {
    beforeEach(() => {
        log('beforeEach in describe');
    });
    
    afterEach(() => {
        log('afterEach in describe');
    })
    
    beforeAll(() => {
        log('beforeAll in describe');
    })
    
    afterAll(() => {
        log('afterAll in describe');
    });

    test('test within describe', () => {
        expect(11).toBe(11);
        expect(5).toBe(11);
    })
})


test('can add two numbers', () => {
    let result = 5+6;

    expect(11).toBe(result);
    expect(11).toBe(result);
})


test('can add two numbers', async () => {
    let result = 5+6;

    expect(11).toBe(result);

    const files = await getFiles();
    //log(files);
    expect(5).toBe(result);
})




/*

test('can add three numbers', async () => {
    let result = 1+2+3;
    await assert.equal(6, result);
    await assert.equal(7, result);
})

*/


function getFiles () {
    return new Promise((resolve, reject) => {
        fs.readdir('.', (err, files) => {
            if (err) return reject(err);
            else return resolve(files);
        })
    })
}