let img;
let posX = 100; // Valores iniciales temporales
let posY = 100;
const squareSize = 20;
const moveAmount = 5;
let characterId = 1; // Cambia esto dinámicamente si es necesario

let keys = {};
let updateInterval;

// Solicitar posición del servidor al cargar
function preload() {
    img = loadImage('/images/background_images/daytime.png');
    fetchCharacterPosition(); // Llama a la función para obtener la posición guardada
}

// Configuración inicial del lienzo y actualización automática de fondo
function setup() {
    const overlay = createCanvas(windowWidth, 600);
    overlay.parent('map');
    overlay.class('overlay');
    noFill();
    setInterval(updateBackgroundAutomatically, 60000); // Actualizar fondo cada minuto
}

// Dibuja el cuadrado y controla el movimiento del personaje
function draw() {
    image(img, 0, 0, width, height);
    fill(255, 0, 0);
    rect(posX, posY, squareSize, squareSize);

    // Control del movimiento del cuadrado
    if (keys[LEFT_ARROW]) {
        posX = max(0, posX - moveAmount);
    }
    if (keys[RIGHT_ARROW]) {
        posX = min(width - squareSize, posX + moveAmount);
    }
    if (keys[UP_ARROW]) {
        posY = max(0, posY - moveAmount);
    }
    if (keys[DOWN_ARROW]) {
        posY = min(height - squareSize, posY + moveAmount);
    }
}

// Función para obtener la posición guardada del servidor
function fetchCharacterPosition() {
    fetch(`/characters/${characterId}/getPositions`) // Asegúrate de usar la ruta correcta
        .then(response => response.json())
        .then(data => {
            if (data.position) { // Cambiado para acceder a la posición correctamente
                posX = data.position.x; // Asigna la posición obtenida
                posY = data.position.y;
            }
        })
        .catch(error => {
            console.error('Error al obtener la posición:', error);
        });
}

// Función para enviar la posición actual al servidor
function updatePositionOnServer(posX, posY, characterId) {
    fetch(`/characters/${characterId}/updatePosition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: { x: posX, y: posY } })
    }).then(response => {
        if (!response.ok) {
            console.error('Error al actualizar la posición en el servidor');
        }
    }).catch(error => {
        console.error('Error en la conexión:', error);
    });
}

// Inicia la actualización de posición en intervalos
function startUpdatingPosition() {
    if (!updateInterval) {
        updateInterval = setInterval(() => {
            updatePositionOnServer(posX, posY, characterId);
        }, 100); // Actualizar cada 100ms
    }
}

// Detiene la actualización de posición
function stopUpdatingPosition() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    updatePositionOnServer(posX, posY, characterId); // Envía la posición final al soltar la tecla
}

// Controla cuando una tecla se presiona para iniciar el movimiento
function keyPressed() {
    keys[keyCode] = true;
    startUpdatingPosition();
}

// Controla cuando una tecla se suelta para detener el movimiento
function keyReleased() {
    keys[keyCode] = false;
    stopUpdatingPosition();
}

// Cambia el fondo de acuerdo a la selección del usuario
function changeBackground() {
    const selector = document.getElementById('backgroundSelector');
    const selectedValue = selector.value;

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
            default:
                imagePath = '/images/background_images/daytime.png';
                break;
        }
        img = loadImage(imagePath);
    }
}

// Cambia el fondo automáticamente según la hora del día
function updateBackgroundAutomatically() {
    const currentHour = new Date().getHours();
    let imagePath;

    if (currentHour >= 6 && currentHour < 12) {
        imagePath = '/images/background_images/morning.png';
    } else if (currentHour >= 12 && currentHour < 18) {
        imagePath = '/images/background_images/daytime.png';
    } else if (currentHour >= 18 && currentHour < 21) {
        imagePath = '/images/background_images/evening.png';
    } else {
        imagePath = '/images/background_images/night.png';
    }
    img = loadImage(imagePath);
}
