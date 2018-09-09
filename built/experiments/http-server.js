"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const server = http.createServer((req, res) => {
    console.log('Is requests and response refering to the same socket?');
    console.log(req.connection === res.socket);
    res.end('\nHi from server, hanging up now. Bye!\n');
});
server.on('connection', (socket) => {
    console.log('Connection from: ' + socket.remoteAddress);
});
server.listen(3000);
//# sourceMappingURL=http-server.js.map