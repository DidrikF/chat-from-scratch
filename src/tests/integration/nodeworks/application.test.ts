import Application from '../../../modules/nodeworks/Application';
import Request from '../../../modules/nodeworks/Request';
import Response from '../../../modules/nodeworks/Response';
import * as http from 'http';
import * as request from 'supertest';
import { networkInterfaces } from 'os';
// const request = require('supertest');


const app = new Application();

let arr: number[] = []
let server: http.Server;

beforeAll(async () => {
    server = app.listen(7327);
})

afterAll(() => {
    server.close();
})

afterEach(() => {
    app.middleware = [];
})

describe('the middleware stack executes downstream and upstream code correctly', () => {

    afterEach(() => {
        arr = [];
    })

    test('Middleware executes code in the correct order', async () => {
        app.use(async (request, response, next) => {
            arr.push(1);
            await next()
            arr.push(6)
        })
        app.use(async (request, response, next) => {
            arr.push(2);
            await next()
            arr.push(5)
        })
        app.use(async (request, response, next) => {
            arr.push(3);
            await next()
            arr.push(4)
        })

        const response = await request(server).get('/');
        expect(arr).arrayEquals([1,2,3,4,5,6])

    })

})



describe('Can work with headers on response in middleware', () => {
    test('Can set header on response', async () => {
        app.use(async (request, response, next) => {
            response.set('Content-Type', 'text/html; charset=utf8');
            await next();
        })

        const response = await request(server).get('/');
        expect(response.get('Content-Type')).toBe('text/html; charset=utf8');
    })

    test('Can get header from request', async () => {
        app.use(async (request, response, next) => {
            expect(request.get('accept')).toBe('image/gif');
            await next();
        })

        await request(server).get('/').set('Accept', 'image/gif');
    })

})


