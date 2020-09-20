const socket = new io();

let canvasX = 400;
let canvasY = 400;

let balle = {};
//let j1 = {};

function setup() {
    createCanvas(canvasX, canvasY);
    background(220, 100, 100);
} 

socket.on('balle', (balleServeur) => {
    background(220, 100, 100);

    balle = balleServeur;

    fill(255, 255, 255);
    circle(balle.x, balle.y, balle.size);

    /*socket.on('j1', (j1Serveur) => {
        j1 = j1Serveur;
        console.log(j1);
    
        rect(j1.x, j1.y, j1.largeur, j1.hauteur);
    });*/
});

