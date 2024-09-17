let battleCount = 0; // Contador de batallas
const evolutions = ['pixelart-to-css1', 'pixelart-to-css2', 'pixelart-to-css3', 'pixelart-to-css4']; // Array de evoluciones
const battleThresholds = [5, 10, 15]; // Número de batallas para cada evolución
let currentEvolution = 0; // Estado de evolución actual
const baseNames = ['Charmander', 'Charmeleon', 'Charizard', 'Mega Charizard']; // Nombres base para cada evolución
let customName = ''; // Nombre personalizado

// Función para cambiar el nombre del personaje
function changeCharacterName() {
    const characterName = document.getElementById('characterNameInput').value.trim();
    if (characterName) {
        customName = characterName; // Guarda el nombre personalizado
    } else {
        customName = ''; // Restablece a nombre vacío si no se ingresa nada
    }
    
    updateCharacterName();
}

// Función para actualizar el nombre del personaje en el display
function updateCharacterName() {
    const nameDisplay = document.getElementById('characterNameDisplay');
    const displayedName = customName || baseNames[currentEvolution]; // Muestra el nombre personalizado si existe, de lo contrario muestra el nombre base
    nameDisplay.textContent = displayedName;
}

// Función para manejar la evolución del ByteMon
function evolve() {
    const spriteElement = document.getElementById('currentSprite');
    const evolutionMessageElement = document.getElementById('evolutionMessage');
    const battleButton = document.getElementById('battleButton'); // Botón de luchar

    if (currentEvolution < evolutions.length - 1) {
        evolutionMessageElement.textContent = 'Evolving...';

        setTimeout(() => {
            spriteElement.classList.remove(evolutions[currentEvolution]);
            currentEvolution++;
            spriteElement.classList.add(evolutions[currentEvolution]);

            // Actualiza el nombre después de la evolución
            updateCharacterName();

            evolutionMessageElement.textContent = '';
        }, 1000);
    } else {
        // Si ya se ha alcanzado el máximo nivel, muestra el mensaje y oculta el botón de luchar
        evolutionMessageElement.textContent = 'Maximum Level Reached!';
        battleButton.style.display = 'none'; // Oculta el botón de luchar
    }
}

// Función de batalla
function fight() {
    battleCount++;
    
    if (battleThresholds.includes(battleCount)) {
        evolve();
    } else {
        document.getElementById('evolutionMessage').textContent = '';
    }
}

// Función para reproducir el sonido basado en la evolución
function playEvolutionSound() {
    const sounds = [
        document.getElementById('sound1'),
        document.getElementById('sound2'),
        document.getElementById('sound3'),
        document.getElementById('sound4')
    ];

    sounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });

    sounds[currentEvolution].play();
}

