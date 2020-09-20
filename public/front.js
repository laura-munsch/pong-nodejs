const socket = new io();

let canvasX = 400;
let canvasY = 400;

let nbJoueurs = 0;
let joueurs = [];
let balle = {};

// création du canvas
function setup() {
    createCanvas(canvasX, canvasY);
    background(220, 100, 100);
    frameRate(20);
} 

// on détecte le nombre de joueurs qui sont connectés
socket.on('nbJoueurs', (nbJoueursServeur) => {
    nbJoueurs = nbJoueursServeur;
});

// on dessine le jeu à chaque déplacement d'un joueur ou de la balle
socket.on('joueurs', (joueursServeur) => {
    joueurs = joueursServeur;

    socket.on('balle', (balleServeur) => {
        balle = balleServeur;

        background(220, 100, 100);
    
        // dessin de la balle :
        fill(255, 255, 255);
        circle(balle.x, balle.y, balle.size);

        // dessin des joueurs :
        for (let i = 0 ; i < nbJoueurs ; i ++) {
            rect(joueurs[i].x, joueurs[i].y, joueurs[i].largeur, joueurs[i].hauteur);
        }
    });
});

// détection du mouvement des joueurs :
function keyPressed() {
    socket.emit('move', keyCode);
}


