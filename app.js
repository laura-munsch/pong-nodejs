const http = require('http');
const server = http.createServer();

const fs = require('fs');

const io = require('socket.io')(server);


server.on('request', (request, response) => {
    //chargement des fichiers :
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

// définition des paramètres du j1 :
let j1 = {
    x: 150,
    y: 370,
    largeur: 100,
    hauteur: 1
};

io.on('connect', (socket) => {
    console.log('Websocket connected');

    io.emit('j1', j1);
    console.log('j1 emited');
});

// définition des paramètres de la balle :
let balle = {
    x: 220, 
    y: 50,
    size: 20,
    speedX: 1,
    speedY: 1
};

setInterval(() => {
    // calcul du déplacement de la balle (contre les murs):
    if (balle.x == 0 + balle.size/2 || balle.x == 400 - balle.size/2) {
        balle.speedX = - balle.speedX;
    }

    if (balle.y == 0 + balle.size/2 || balle.y == 400 - balle.size/2) {
        balle.speedY = - balle.speedY;
    }

    // calcul du déplacement de la balle (contre les joueurs) :
    if (balle.x > j1.x - balle.size / 2 && balle.x < j1.x + j1.largeur + balle.size / 2 && balle.y > j1.y - balle.size / 2) {
        balle.speddX = - balle.speedX;
        balle.speedY = - balle.speedY;
    }

    balle.x += balle.speedX;
    balle.y += balle.speedY;

    io.emit('balle', balle);
}, 1000 / 60);

server.listen(8080);

console.log('App started');


