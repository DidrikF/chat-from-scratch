import * as http from 'http';
import * as util from 'util';

import Application from './Application';

// Maybe do it like koa, and just have this be an object, which will be the prototype of the reqest object in the application.

export default class Response {
    res: http.ServerResponse;
    app: Application;

    constructor (res: http.ServerResponse) {
        this.res = res;
    }


    set (header: string, value: any) {
        this.res.setHeader(header, value);
    }


    set statusCode (status: number) {
        this.res.statusCode = status;
    }
    
    set statusMessage (message: string) {
        this.res.statusMessage = message;
    }



    send () {
        this.res.end();
    }


    onerror(err: any) {
        // don't do anything if there is no error.
        // this allows you to pass `this.onerror`
        // to node-style callbacks.
        if (null == err) return;
    
        if (!(err instanceof Error)) err = new Error(util.format('non-error thrown: %j', err));
    
        let headerSent = false;
        if (this.headerSent || !this.writable) {
          headerSent = err.headerSent = true;
        }
    
        // delegate
        this.app.emit('error', err, this);
    
        // nothing we can do here other
        // than delegate to the app-level
        // handler and log.
        if (headerSent) {
          return;
        }
    
        const { res } = this;
    
        // first unset all headers
        /* istanbul ignore else */
        if (typeof res.getHeaderNames === 'function') {
          res.getHeaderNames().forEach(name => res.removeHeader(name));
        } else {
          res._headers = {}; // Node < 7.7
        }
    
        // then set those specified
        this.set(err.headers);
    
        // force text/plain
        this.type = 'text';
    
        // ENOENT support
        if ('ENOENT' == err.code) err.status = 404;
    
        // default to 500
        if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;
    
        // respond
        const code = statuses[err.status];
        const msg = err.expose ? err.message : code;
        this.status = err.status;
        this.length = Buffer.byteLength(msg);
        this.res.end(msg);
      },
    
      get cookies() {
        if (!this[COOKIES]) {
          this[COOKIES] = new Cookies(this.req, this.res, {
            keys: this.app.keys,
            secure: this.request.secure
          });
        }
        return this[COOKIES];
      },
    
      set cookies(_cookies) {
        this[COOKIES] = _cookies;
      }
    };
    
}
