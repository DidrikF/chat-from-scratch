import * as http from 'http';


export default class Response {
    res: http.ServerResponse;

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


    errorHandler (error: any) {
        console.log(error)
    }
    
}