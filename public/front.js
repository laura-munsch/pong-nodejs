const socket = new io();

let canvasX = 400;
let canvasY = 400;

let balle = {};
//let j1 = {};

function setup() {
    createCanvas(canvasX, canvasY);
    background(220, 100, 100);
    frameRate(20);
} 

socket.on('j1', (j1Serveur) => {
    j1 = j1Serveur;

    socket.on('balle', (balleServeur) => {
        balle = balleServeur;

        background(220, 100, 100);
    
        fill(255, 255, 255);
        circle(balle.x, balle.y, balle.size);
        rect(j1.x, j1.y, j1.largeur, j1.hauteur);
    });
});


