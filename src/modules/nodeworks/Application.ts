import * as http from 'http';
import Request from './Request';
import Response from './Response';

import * as onFinished from 'on-finished';

import * as Emitter from 'events';
import * as util from 'util';

//const compose = require('koa-compose');


export default class Application extends Emitter {

    middleware: Function[];
    request: Request;
    response: Response;
    silent: boolean;

    constructor() {
        super();

        this.middleware = [];
        this.request = Object.create(Request);
        this.response = Object.create(Response);
        this.silent = false;
    }

    listen(...args: any[]){
        if (args[0]) {
            console.log('listen on port: ' + args[0]);
        } else {
            console.log('listen')
        }
        const server = http.createServer(this.serverHandler());
        server.listen(...args);
        return server;

    }

    serverHandler() {
        // do work to get the handler ready
        const fn = compose(this.middleware); // this should return a promise

        if (!this.listenerCount('error')) this.on('error', this.onerror);

        const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse): void => {
            // Do some setup
            console.log('Doing some setup')
            const request = this.createRequest(req);
            const response = this.createResponse(res);
            // Deal with request
            this.requestHandler(request, response, fn);
        }
        // return a function which will handle the requets
        return requestHandler;
    }

    requestHandler (request: Request, response: Response, fnMiddleware: Function) {
        response.statusCode = 404;
        const onerror = (err: any) => response.onerror(err);
        const handleResponse = () => respond(request, response)
        // respond function, imported as own module
        const res = response.res;
        onFinished(res, onerror); // Deal with later (regiters some listeners to be executed when the request is deat with, the response has been sent and we do some cleanup or something)
        return fnMiddleware(request, response).then(handleResponse).catch(onerror);
    }

    
    createRequest(req: http.IncomingMessage): Request {
        const request = new Request(req); // check out createContext
        request.app = this;
        return request
    }
    
    createResponse(res: http.ServerResponse): Response {
        const response = new Response(res); // check out createContext
        response.app = this;
        return response;
    }
    
    
    use (middleware: (request: Request, response: Response, next: Function) => void): Application {
        if (typeof middleware !== 'function') throw new TypeError("'middleware must be a function!");
        this.middleware.push(middleware);
        return this;
    }

    /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

    onerror(err: any) { // this is registered as app.on('error', callback) listener, if not the user has done this himself.
        if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

        if (404 == err.status || err.expose) return; // where are these set
        if (this.silent) return;

        const msg = err.stack || err.toString();
        console.error();
        console.error(msg.replace(/^/gm, '  '));
        console.error();
    }

    
}

// NEXT CHALLENGE: HOW TO HANDLE STACK OF ASYNC FUNCTIONS? see compose function at the bottom for inspiration.

function compose(middleware: Function[]): Function { // this whole function return a promise 
    // Check that middleware is an array of functions... (done for me by typescript...)

    return function (request: Request, response: Response, next: Function) {
        let index = -1;
        return dispatch(0); // returns a promise
        
        function dispatch (i: number) {
            index = i; 
            let fn = middleware[i];
            if (i === middleware.length) fn = next
            if (!fn) return Promise.resolve();
            try {
                return Promise.resolve(fn(request, response, dispatch.bind(null, i+1))); // recursivly calls middleware in the stack
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }

}


function respond (request: Request, response: Response) {
    // need to implement
    response.res.end() 

}
