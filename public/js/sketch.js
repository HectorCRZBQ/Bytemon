let img; // Variable para almacenar la imagen
let posX = 100;  // Posición inicial del cuadrado
let posY = 100;
const squareSize = 20; // Tamaño del cuadrado
const moveAmount = 5; // Cantidad de píxeles para mover el cuadrado

// Arreglo para controlar las teclas presionadas
let keys = {};

function preload() {
    // Cargar la imagen de fondo por defecto
    img = loadImage('/images/background_images/daytime.png');
}

function setup() {
    // Configurar el canvas de p5.js que cubrirá el mapa
    const overlay = createCanvas(windowWidth, 600); // Crear un canvas con la altura del mapa
    overlay.parent('map'); // Insertar el canvas en el div del mapa
    overlay.class('overlay');
    noFill(); // El fondo no tendrá relleno en el setup

    // Comenzar a cambiar la imagen de fondo automáticamente
    setInterval(updateBackgroundAutomatically, 60000); // Actualiza cada minuto
}

function draw() {
    // Dibujar la imagen de fondo
    image(img, 0, 0, width, height); // Dibujar la imagen a escala completa

    // Dibujar cuadrado en la posición actual
    fill(255, 0, 0); // Relleno rojo para el cuadrado
    rect(posX, posY, squareSize, squareSize); // Dibujar cuadrado

    // Mover el cuadrado según las teclas presionadas
    if (keys[LEFT_ARROW]) {
        posX = max(0, posX - moveAmount); // Mover a la izquierda
    }
    if (keys[RIGHT_ARROW]) {
        posX = min(width - squareSize, posX + moveAmount); // Mover a la derecha
    }
    if (keys[UP_ARROW]) {
        posY = max(0, posY - moveAmount); // Mover hacia arriba
    }
    if (keys[DOWN_ARROW]) {
        posY = min(height - squareSize, posY + moveAmount); // Mover hacia abajo
    }
}

// Cambiar la imagen de fondo basado en la selección
function changeBackground() {
    const selector = document.getElementById('backgroundSelector');
    const selectedValue = selector.value;

    // Determinar la ruta de la imagen seleccionada
    if (selectedValue === 'automatic') {
        updateBackgroundAutomatically();
    } else {
        let imagePath;
        switch (selectedValue) {
            case 'evening':
                imagePath = '/images/background_images/evening.png';
                break;
            case 'morning':
                imagePath = '/images/background_images/morning.png';
                break;
            case 'night':
                imagePath = '/images/background_images/night.png';
                break;
            default: // 'daytime'
                imagePath = '/images/background_images/daytime.png';
                break;
        }

        // Cargar la nueva imagen
        img = loadImage(imagePath);
    }
}

// Función para actualizar la imagen de fondo automáticamente
function updateBackgroundAutomatically() {
    const currentHour = new Date().getHours();
    let imagePath;

    // Cambiar la imagen según la hora del día
    if (currentHour >= 6 && currentHour < 12) {
        imagePath = '/images/background_images/morning.png'; // 6 AM - 11:59 AM
    } else if (currentHour >= 12 && currentHour < 18) {
        imagePath = '/images/background_images/daytime.png'; // 12 PM - 5:59 PM
    } else if (currentHour >= 18 && currentHour < 21) {
        imagePath = '/images/background_images/evening.png'; // 6 PM - 8:59 PM
    } else {
        imagePath = '/images/background_images/night.png'; // 9 PM - 5:59 AM
    }

    // Cargar la nueva imagen
    img = loadImage(imagePath);
}

// Manejar las teclas de flecha
function keyPressed() {
    keys[keyCode] = true; // Marcar la tecla como presionada
}

function keyReleased() {
    keys[keyCode] = false; // Marcar la tecla como liberada
}
