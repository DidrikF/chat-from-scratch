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
afterEach(() => {
    app.middleware = [];
});
describe('the middleware stack executes downstream and upstream code correctly', () => {
    afterEach(() => {
        arr = [];
    });
    test('Middleware executes code in the correct order', () => __awaiter(this, void 0, void 0, function* () {
        app.use((request, response, next) => __awaiter(this, void 0, void 0, function* () {
            arr.push(1);
            yield next();
            arr.push(6);
        }));
        app.use((request, response, next) => __awaiter(this, void 0, void 0, function* () {
            arr.push(2);
            yield next();
            arr.push(5);
        }));
        app.use((request, response, next) => __awaiter(this, void 0, void 0, function* () {
            arr.push(3);
            yield next();
            arr.push(4);
        }));
        const response = yield request(server).get('/');
        expect(arr).arrayEquals([1, 2, 3, 4, 5, 6]);
    }));
});
describe('Can work with headers on response in middleware', () => {
    test('Can set header on response', () => __awaiter(this, void 0, void 0, function* () {
        app.use((request, response, next) => __awaiter(this, void 0, void 0, function* () {
            response.set('Content-Type', 'text/html; charset=utf8');
            yield next();
        }));
        const response = yield request(server).get('/');
        expect(response.get('Content-Type')).toBe('text/html; charset=utf8');
    }));
    test('Can get header from request', () => __awaiter(this, void 0, void 0, function* () {
        app.use((request, response, next) => __awaiter(this, void 0, void 0, function* () {
            expect(request.get('accept')).toBe('image/gif');
            yield next();
        }));
        yield request(server).get('/').set('Accept', 'image/gif');
    }));
});
//# sourceMappingURL=application.test.js.map