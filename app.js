const http = require('http');
const server = http.createServer();

const fs = require('fs');

const io = require('socket.io')(server);

const pino = require('pino')('app.log');


server.on('request', (request, response) => {
    if (request.url == '/') {
        fs.readFile('public/front.html', (error, content) => {
            response.writeHead(200, {'Content-type' : 'text/html'});
            response.write(content);
            response.end();
        });
    } else if (request.url == '/front.js') {
        fs.readFile('public/front.js', (error, content) => {
            response.writeHead(200, {'Content-type' : 'application/javascript'});
            response.write(content);
            response.end();
        });
    }
});

io.on('connect', (socket) => {
    console.log('Websocket connected');

    socket.on('message', (msg) => {
        console.log(msg);
    });
});

server.listen(8080);

console.log('App started');


