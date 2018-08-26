// const { test, assert } = require('../modules/testing/index');

import { test, assert } from '../../modules/testing/index';

module.exports = async function runTests() {
    await test('can add two numbers', async () => {
        let result = 5+6;
        await assert.equal(11, result);
        await assert.equal(9, result);
    })
    
    await test('can add three numbers', async () => {
        let result = 1+2+3;
        await assert.equal(6, result);
        await assert.equal(7, result);
    })
}