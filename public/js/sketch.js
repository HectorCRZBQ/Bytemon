let img;
let playerImg; // Imagen del jugador principal
let otherPlayerImg; // Imagen de otros jugadores
let posX = 100; // Valores iniciales temporales
let posY = 100;
const squareSize = 40; // Aumentar el tamaño del sprite (ancho y alto)
const moveAmount = 5;
let characterId;

let keys = {};
let updateInterval;
let otherPlayers = {}; // Almacena las posiciones de otros jugadores

const socket = io(); // Conectar al servidor de sockets

// Solicitar posición del servidor al cargar
function preload() {
    img = loadImage('/images/background_images/daytime.png');
    playerImg = loadImage('/images/pikas/pika_1.gif'); // Cargar imagen del jugador principal
    otherPlayerImg = loadImage('/images/pikas/pika_2.gif'); // Cargar imagen de otros jugadores
    fetchCharacterPosition(); // Llama a la función para obtener la posición guardada
}

// Configuración inicial del lienzo y actualización automática de fondo
function setup() {
    getCharacterIdFromSession().then(() => {
        // Ahora que tenemos characterId, cargamos la posición inicial
        fetchCharacterPosition();

        // Configurar el lienzo
        const overlay = createCanvas(windowWidth, 600);
        overlay.parent('map');
        overlay.class('overlay');
        noFill();
        setInterval(updateBackgroundAutomatically, 60000); // Cambiar el fondo cada minuto
    }).catch(error => {
        console.error('Error al obtener el ID del personaje:', error);
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
    });
}

// Dibuja el personaje y controla el movimiento
function draw() {
    image(img, 0, 0, width, height);
    
    // Dibuja el personaje del usuario con la imagen del GIF
    image(playerImg, posX, posY, squareSize, squareSize); // Usar la imagen cargada con tamaño aumentado

    // Dibuja otros jugadores
    for (let id in otherPlayers) {
        const playerPos = otherPlayers[id];
        image(otherPlayerImg, playerPos.x, playerPos.y, squareSize, squareSize); // Usar la imagen de otros jugadores con tamaño aumentado
    }

    // Control del movimiento del personaje
    if (keys[LEFT_ARROW]) {
        posX = max(0, posX - moveAmount);
        sendPosition();
    }
    if (keys[RIGHT_ARROW]) {
        posX = min(width - squareSize, posX + moveAmount);
        sendPosition();
    }
    if (keys[UP_ARROW]) {
        posY = max(0, posY - moveAmount);
        sendPosition();
    }
    if (keys[DOWN_ARROW]) {
        posY = min(height - squareSize, posY + moveAmount);
        sendPosition();
    }
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
        img = loadImage(imagePath); // Cambia la imagen de fondo
    }
}

// Función para enviar la posición al servidor
function sendPosition() {
    socket.emit('updatePosition', {
        id: characterId,
        position: { x: posX, y: posY }
    });
}

// Función para recibir actualizaciones de posición de otros jugadores
socket.on('positionUpdated', (data) => {
    otherPlayers[data.id] = data.position; // Actualiza la posición de otros jugadores
});

// Función para manejar la desconexión de otros jugadores
socket.on('playerDisconnected', (id) => {
    delete otherPlayers[id]; // Eliminar al jugador desconectado de la lista
});

// Función para obtener la posición inicial desde el servidor
function fetchCharacterPosition() {
    fetch(`/characters/${characterId}/getPositions`)
        .then(response => response.json())
        .then(data => {
            if (data.position) {
                posX = data.position.x;
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
    img = loadImage(imagePath); // Cambiar la imagen de fondo
}

function getCharacterIdFromSession() {
    return fetch('/characterId') // Llamada al endpoint para obtener el ID del personaje
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el ID del personaje');
            }
            return response.json();
        })
        .then(data => {
            if (data.id) {
                characterId = data.id; // Asignar el ID del personaje a la variable global
            } else {
                console.error('No se encontró un ID de personaje válido');
            }
        })
        .catch(error => {
            console.error('Error al obtener el ID del personaje:', error);
        });
}


// Función para enviar el mensaje
function sendMessage(message) {
    socket.emit('chatMessage', { message: message, id: characterId });
}

// Recibir mensajes de otros jugadores
socket.on('chatMessage', (data) => {
    // Crear un nuevo div para el mensaje
    const messageElement = document.createElement('div');
    
    // Si el mensaje lo envió el jugador, se marca como "Tú"
    if (data.id === characterId) {
        messageElement.textContent = `Tú: ${data.message}`;
        messageElement.classList.add('self-message'); // Clase para diferenciar mensajes propios
    } else {
        messageElement.textContent = `Jugador ${data.id}: ${data.message}`;
        messageElement.classList.add('other-message'); // Clase para los mensajes de otros jugadores
    }

    // Agregar el mensaje al contenedor de mensajes
    document.getElementById('messages').appendChild(messageElement);
    // Hacer scroll hacia el final para mostrar siempre el último mensaje
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

// Manejar el evento de enviar un mensaje
document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto (recargar la página)

    const message = document.getElementById('chat-message').value;
    if (message.trim()) {
        // Mostrar el mensaje en el chat local (antes de enviarlo)
        const messageElement = document.createElement('div');
        messageElement.textContent = `Tú: ${message}`; // "Tú" para indicar que lo envió el jugador
        messageElement.classList.add('self-message'); // Añadir clase CSS para los mensajes del jugador
        document.getElementById('messages').appendChild(messageElement);
        
        // Enviar el mensaje al servidor
        socket.emit('chatMessage', { message: message, id: characterId });

        // Limpiar el campo de texto
        document.getElementById('chat-message').value = '';
        // Hacer scroll hacia el final para mostrar siempre el último mensaje
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    }
});

// Botón de borrar los mensajes
document.getElementById('clearChatBtn').addEventListener('click', () => {
    // Limpiar todos los mensajes del chat
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = ''; // Eliminar todo el contenido
});

// Botón de ocultar/mostrar chat
let isChatVisible = true;
document.getElementById('toggleChatBtn').addEventListener('click', () => {
    const chatContainer = document.getElementById('chat-container');
    
    // Alternar la visibilidad del chat
    if (isChatVisible) {
        chatContainer.style.display = 'none';
    } else {
        chatContainer.style.display = 'block';
    }
    
    // Cambiar el estado de visibilidad
    isChatVisible = !isChatVisible;
});

function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    const toggleChatBtn = document.getElementById('toggleChatBtn');
    
    // Si el chat está visible, lo ocultamos y cambiamos el texto del botón
    if (chatContainer.style.display !== 'none') {
        chatContainer.style.display = 'none';
        toggleChatBtn.textContent = 'Mostrar Chat';
    } else {
        // Si el chat está oculto, lo mostramos y cambiamos el texto del botón
        chatContainer.style.display = 'block';
        toggleChatBtn.textContent = 'Ocultar Chat';
    }
}
