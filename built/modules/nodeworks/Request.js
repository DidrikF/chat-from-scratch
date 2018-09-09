"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Request {
    constructor(req) {
        this.req = req;
    }
    get(header) {
        console.log(this.req.headers);
        return this.req.headers[header];
    }
    data() {
        return this.req.read();
    }
    toJSON(obj) {
        return JSON.stringify(this.req);
    }
}
exports.default = Request;
/*
class Socket extends EventEmitter {
    consturctor() {
        this.on('connection', () => {
            console.log("Connection incomming!")
        })
    }
}

*/
// the socket implementation in node will call:
// socket.emit('connection') // when a new connection had come in. 
// socket.listen(3000); // this will create a TCP socket using c++ bindings of the JS runtime, on a connection, a callback is queued in the pole phase, this callback calls socket.emit('connection')
//# sourceMappingURL=Request.js.map