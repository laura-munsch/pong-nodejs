const socket = new io();

let canvasX = 400;
let canvasY = 400;

let balle = {};

function setup() {
    createCanvas(canvasX, canvasY);
    background(220, 100, 100);
    frameRate(20);
} 

socket.on('balle', (balleServeur) => {
    balle = balleServeur;
}); 

function draw() {
    if (balle.go) {
        background(220, 100, 100);
        fill(255, 255, 255);
        circle(balle.x, balle.y, balle.size);
    }

    console.log('x : ' + balle.x + ' | y : ' + balle.y);
}
