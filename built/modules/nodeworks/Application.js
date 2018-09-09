"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Request_1 = require("./Request");
const Response_1 = require("./Response");
const onFinished = require("on-finished");
const Emitter = require("events");
const util = require("util");
//const compose = require('koa-compose');
class Application extends Emitter {
    constructor() {
        super();
        this.middleware = [];
        this.request = Object.create(Request_1.default);
        this.response = Object.create(Response_1.default);
        this.silent = false;
    }
    listen(...args) {
        if (args[0]) {
            console.log('listen on port: ' + args[0]);
        }
        else {
            console.log('listen');
        }
        const server = http.createServer(this.serverHandler());
        server.listen(...args);
        return server;
    }
    serverHandler() {
        // do work to get the handler ready
        const fn = compose(this.middleware); // this should return a promise
        if (!this.listenerCount('error'))
            this.on('error', this.onerror);
        const requestHandler = (req, res) => {
            // Do some setup
            console.log('Doing some setup');
            const request = this.createRequest(req);
            const response = this.createResponse(res);
            // Deal with request
            this.requestHandler(request, response, fn);
        };
        // return a function which will handle the requets
        return requestHandler;
    }
    requestHandler(request, response, fnMiddleware) {
        response.statusCode = 404;
        const onerror = (err) => response.onerror(err);
        const handleResponse = () => respond(request, response);
        // respond function, imported as own module
        const res = response.res;
        onFinished(res, onerror); // Deal with later (regiters some listeners to be executed when the request is deat with, the response has been sent and we do some cleanup or something)
        return fnMiddleware(request, response).then(handleResponse).catch(onerror);
    }
    createRequest(req) {
        const request = new Request_1.default(req); // check out createContext
        request.app = this;
        return request;
    }
    createResponse(res) {
        const response = new Response_1.default(res); // check out createContext
        response.app = this;
        return response;
    }
    use(middleware) {
        if (typeof middleware !== 'function')
            throw new TypeError("'middleware must be a function!");
        this.middleware.push(middleware);
        return this;
    }
    /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */
    onerror(err) {
        if (!(err instanceof Error))
            throw new TypeError(util.format('non-error thrown: %j', err));
        if (404 == err.status || err.expose)
            return; // where are these set
        if (this.silent)
            return;
        const msg = err.stack || err.toString();
        console.error();
        console.error(msg.replace(/^/gm, '  '));
        console.error();
    }
}
exports.default = Application;
// NEXT CHALLENGE: HOW TO HANDLE STACK OF ASYNC FUNCTIONS? see compose function at the bottom for inspiration.
function compose(middleware) {
    // Check that middleware is an array of functions... (done for me by typescript...)
    return function (request, response, next) {
        let index = -1;
        return dispatch(0); // returns a promise
        function dispatch(i) {
            index = i;
            let fn = middleware[i];
            if (i === middleware.length)
                fn = next;
            if (!fn)
                return Promise.resolve();
            try {
                return Promise.resolve(fn(request, response, dispatch.bind(null, i + 1))); // recursivly calls middleware in the stack
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
    };
}
function respond(request, response) {
    // need to implement
    response.res.end();
}
//# sourceMappingURL=Application.js.map