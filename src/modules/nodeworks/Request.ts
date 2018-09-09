import * as http from 'http';
import * as EventEmitter from 'events';
import Application from './Application';


export default class Request {
    
    req: http.IncomingMessage;
    app: Application;

    constructor (req: http.IncomingMessage) {
        this.req = req;
    }

    get(header: string) {
        console.log(this.req.headers);
        return this.req.headers[header];
    }

    data() {
        return this.req.read();
    }

    toJSON(obj: object) {
        return JSON.stringify(this.req);
    }

}














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