import * as http from 'http';
import Request from './Request';
import Response from './Response';

//const compose = require('koa-compose');

export default class Application {

    middleware: Function[];

    constructor() {
        this.middleware = [];
    }

    listen(){

    }

    serverHandler() {
        // do work to get the handler ready
        const fn = compose(this.middleware); // this should return a promise

        
        const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse): void => {
            // Do some setup
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
        const errorHandler = (err: any) => response.errorHandler(err);
        const handleResponse = () => respond(request, response);
        // onFinished(res, errorHandler); // Deal with later
        return fnMiddleware(request, response).then(handleResponse).catch(errorHandler);
    }

    
    createRequest(req: http.IncomingMessage): Request {
        const request = new Request(req); // check out createContext
        return request
    }
    
    createResponse(res: http.ServerResponse): Response {
        const response = new Response(res); // check out createContext
        return response;
    }
    
    
    use (middleware: Function): Application {
        if (typeof middleware !== 'function') throw new TypeError("'middleware must be a function!");
        this.middleware.push(middleware);
        return this;
    }
    
}

// NEXT CHALLENGE: HOW TO HANDLE STACK OF ASYNC FUNCTIONS? see compose function at the bottom for inspiration.

function compose(middleware: Function[]): Promise<void> { // this whole function return a promise 
    return function (next)
}


function respond (request: Request, response: Response) {

}

/*
*  This is a cluster fuck if stuff I don't know well enough.
*

function onFinished(res: http.ServerResponse, listener: Function) { // listener == errorHandler
    // handels both websockets and normal http requests on Github.
    if (isFinished(res) === true) {
        defer(listener, null, res);
        return res;
    }

    attachListener(res, listener);

    return res;
}

function isFinished(msg: http.ServerResponse): boolean {
    var socket = msg.socket; // where does this come from?

    if (typeof msg.finished === 'boolean') {
        // OutgoingMessage
        return Boolean(msg.finished || (socket && !socket.writable))
    }
}

*/


/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
      if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }
  
    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
  
    return function (context, next) {
      // last called middleware #
      let index = -1
      
      return dispatch(0)
      
      function dispatch (i) { // there is closure over this function
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))
        index = i // 0 = 0
        let fn = middleware[i] //middleware[0]
        if (i === middleware.length) fn = next // when out of middleware, set fn = next
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); // recursively calling middleware.
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }



