import { test, assert } from '../../../modules/testing/index';

module.exports = async function runTests() {
    await test('testName', async () => {
        await assert.equal(7,8);
    })

}