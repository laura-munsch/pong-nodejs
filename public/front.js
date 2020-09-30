const socket = new io();

let canvasX = 400;
let canvasY = 400;

let nbJoueurs = 0;
let joueurs = [];
let balle = {};

let joueurActuel = 0;

// création du canvas
function setup() {
    createCanvas(canvasX, canvasY);
    background(220, 100, 100);
    frameRate(20);

    main();
} 

function main() {
    console.log('page chargée pour joueur ' + joueurActuel + ' !');

    // on détecte le nombre de joueurs qui sont connectés
    socket.on('nbJoueurs', (nbJoueursServeur) => {
        nbJoueurs = nbJoueursServeur;

        if (joueurActuel == 0) {
            joueurActuel = nbJoueurs;
        }
    });

    // on dessine le jeu à chaque déplacement d'un joueur ou de la balle
    socket.on('joueurs', (joueursServeur) => {
        joueurs = joueursServeur;

        socket.on('balle', (balleServeur) => {
            balle = balleServeur;

            background(220, 100, 100);
        
            // dessin de la balle :
            fill(255, 255, 255);
            noStroke();
            circle(balle.x, balle.y, balle.size);

            // dessin des joueurs :
            for (let i = 0 ; i < nbJoueurs ; i ++) {
                // on affiche le joueur du client d'une couleur différente
                if (i + 1 == joueurActuel) {
                    stroke(0, 0, 255);
                    console.log('yes');
                } else {
                    stroke(0, 0, 0);
                }
                rect(joueurs[i].x, joueurs[i].y, joueurs[i].largeur, joueurs[i].hauteur);
            }
        });
    });
} 

// détection du mouvement des joueurs :
function keyPressed() {
    let mouvement = {
        touche: keyCode,
        joueur: joueurActuel - 1
    };
    socket.emit('move', mouvement);
}

