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
const Application_1 = require("../../../modules/nodeworks/Application");
const request = require("supertest");
// const request = require('supertest');
const app = new Application_1.default();
let arr = [];
let server;
beforeAll(() => __awaiter(this, void 0, void 0, function* () {
    server = app.listen(7327);
}));
afterAll(() => {
    server.close();
});
test('can add error listener', () => __awaiter(this, void 0, void 0, function* () {
    app.on('error', (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).not.toBe('Boom boom!');
    });
    app.use(() => __awaiter(this, void 0, void 0, function* () {
        throw new Error('Boom boom!');
    }));
    yield request(server).get('/');
}));
//# sourceMappingURL=errors.test.js.map