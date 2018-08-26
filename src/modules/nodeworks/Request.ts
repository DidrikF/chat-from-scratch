import * as http from 'http';

export default class Request {
    
    req: http.IncomingMessage;

    constructor (req: http.IncomingMessage) {
        this.req = req;
    }

    get(header: string) {
        return this.req.headers[header];
    }

    data() {
        return this.req.read();
    }

    toJSON(obj: object) {
        return JSON.stringify(this.req);
    }

}