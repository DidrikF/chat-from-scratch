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
// import { expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '../modules/testing/index';
const fs = require("fs");
/** group integration */
beforeEach(() => __awaiter(this, void 0, void 0, function* () {
    log('beforeEach in file');
    const files = yield getFiles();
    log(files);
}));
afterEach(() => {
    log('afterEach in file');
});
beforeAll(() => {
    log('beforeAll in file');
});
afterAll(() => {
    log('afterAll in file');
});
describe('a description of a collection of tests', () => {
    beforeEach(() => {
        log('beforeEach in describe');
    });
    afterEach(() => {
        log('afterEach in describe');
    });
    beforeAll(() => {
        log('beforeAll in describe');
    });
    afterAll(() => {
        log('afterAll in describe');
    });
    test('test within describe', () => {
        expect(11).toBe(11);
        expect(5).toBe(11);
    });
});
test('can add two numbers', () => {
    let result = 5 + 6;
    expect(11).toBe(result);
    expect(11).toBe(result);
});
test('can add two numbers', () => __awaiter(this, void 0, void 0, function* () {
    let result = 5 + 6;
    expect(11).toBe(result);
    const files = yield getFiles();
    //log(files);
    expect(5).toBe(result);
}));
/*

test('can add three numbers', async () => {
    let result = 1+2+3;
    await assert.equal(6, result);
    await assert.equal(7, result);
})

*/
function getFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir('.', (err, files) => {
            if (err)
                return reject(err);
            else
                return resolve(files);
        });
    });
}
//# sourceMappingURL=unit.test.js.map