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

    let balle = {
        x: 40, 
        y: 50,
        size: 20,
        speedX: 1,
        speedY: 1,
        go: true
    };

    setInterval(() => {
        if (balle.x == 0 + balle.size/2 || balle.x == 400 - balle.size/2 ) {
            balle.speedX = balle.speedX * (-1);
        }

        if (balle.y == 0 + balle.size/2 || balle.y == 400 - balle.size/2) {
            balle.speedY = balle.speedY * (-1);
        }

        balle.x += balle.speedX;
        balle.y += balle.speedY;

        io.emit('balle', balle);
    }, 50);

});

server.listen(8080);

console.log('App started');


