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

// nombre de personnes connectées
nbJoueurs = 0;

// définition des paramètres des joueurs :
let joueurs = [
    {
        x: 150,
        y: 30,
        largeur: 100,
        hauteur: 1
    },
    {
        x: 370,
        y: 150,
        largeur: 1,
        hauteur: 100
    },
    {
        x: 150,
        y: 370,
        largeur: 100,
        hauteur: 1
    },
    {
        x: 30,
        y: 150,
        largeur: 1,
        hauteur: 100
    },
];

// à la connexion d'une des personnes :
io.on('connect', (socket) => {
    // on attend un peu pour être sûrs que la page du client s'est affichée
    setTimeout(() => {
        // le nombre de joueurs connectés augmente
        nbJoueurs ++;
        io.emit('nbJoueurs', nbJoueurs);
        io.emit('joueurs', joueurs);
        console.log('Joueur ' + nbJoueurs + ' connecté');
    }, 300);

    // détection d'une touche du clavier et renvoie des valeurs du joueurs[0] mises à jour
    socket.on('move', (mouv) => {
        let j = mouv.joueur;

        if ((j == 0 || j == 2) && (mouv.touche == 37 && joueurs[j].x > 0)) {
            joueurs[j].x -= 10;
        } else if ((j == 0 || j == 2) && (mouv.touche == 39 && joueurs[j].x < 400 - joueurs[j].largeur)) {
            joueurs[j].x += 10;
        } else if ((j == 1 || j == 3) && (mouv.touche == 38 && joueurs[j].y > 0)) {
            joueurs[j].y -= 10;
        } else if ((j == 1 || j == 3) && (mouv.touche == 40 && joueurs[j].y < 400 - joueurs[j].hauteur)) {
            joueurs[j].y += 10;
        }

        io.emit('joueurs', joueurs);
    });

    // à la déconnexion, on met à jour le nombre de joueurs et on renvoie les données actualisées
    socket.on('disconnect', () => {
        nbJoueurs --;
        io.emit('nbJoueurs', nbJoueurs);
        io.emit('joueurs', joueurs);
        console.log('Joueur déconnecté');
    });
});

// définition des paramètres de la balle :
let balle = {
    x: 220, 
    y: 50,
    size: 20,
    speedX: 1,
    speedY: 1
};

// calculé et envoyé presque en continu pour faire avancer la balle
setInterval(() => {
    // calcul du déplacement de la balle (contre les murs):
    // horizontal
    if (balle.x == 0 + balle.size/2 || balle.x == 400 - balle.size/2) {
        balle.speedX = - balle.speedX;
    }
    // vertical
    if (balle.y == 0 + balle.size/2 || balle.y == 400 - balle.size/2) {
        balle.speedY = - balle.speedY;
    }

    // calcul du déplacement de la balle (contre les joueurs) :
    // horizontal
    if ((nbJoueurs > 0 && balle.x > joueurs[0].x - balle.size / 2 && balle.x < joueurs[0].x + joueurs[0].largeur + balle.size / 2 && balle.y < joueurs[0].y + balle.size / 2) ||
        (nbJoueurs > 2 && balle.x > joueurs[2].x - balle.size / 2 && balle.x < joueurs[2].x + joueurs[2].largeur + balle.size / 2 && balle.y > joueurs[2].y - balle.size / 2)) {
        balle.speedY = - balle.speedY;
    }
    // vertical
    if ((nbJoueurs > 1 && balle.y > joueurs[1].y - balle.size / 2 && balle.y < joueurs[1].y + joueurs[1].hauteur + balle.size / 2 && balle.x > joueurs[1].x - balle.size / 2) ||
        (nbJoueurs > 3 && balle.y > joueurs[3].y - balle.size / 2 && balle.y < joueurs[3].y + joueurs[3].hauteur + balle.size / 2 && balle.x < joueurs[3].x + balle.size / 2)) {
        balle.speedX = - balle.speedX;
    }

    // la balle avance
    balle.x += balle.speedX;
    balle.y += balle.speedY;

    io.emit('balle', balle);
}, 1000 / 60);

server.listen(8080);

console.log('App started');