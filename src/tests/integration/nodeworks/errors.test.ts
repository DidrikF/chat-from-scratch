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


test('can add error listener', async () => {
    app.on('error', (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).not.toBe('Boom boom!');
    })

    app.use(async () => {
        throw new Error('Boom boom!');
    })

    await request(server).get('/');
    
});