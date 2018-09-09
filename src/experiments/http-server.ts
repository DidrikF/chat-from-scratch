import * as http from 'http';


const server = http.createServer((req, res) => { // The requestListener is a function which is automatically added to the 'request' event.
    
    console.log('Is requests and response refering to the same socket?')
    console.log(req.connection === res.socket) // the Node type decleration is lacking!
    res.end('\nHi from server, hanging up now. Bye!\n')
})

server.on('connection', (socket) => {
    console.log('Connection from: ' + socket.remoteAddress)
})

server.listen(3000);



server.on('request', () => {

})