let battleCount = 0; // Contador de batallas
const firstEvolution = 5; // Número de batallas para la primera evolución
const secondEvolution = 10; // Número de batallas para la segunda evolución
const thirdEvolution = 15; // Número de batallas para la tercera evolución
let currentEvolution = 0; // Estado de evolución actual

// Función para cambiar el nombre del personaje
function changeCharacterName() {
    const characterName = document.getElementById('characterNameInput').value;
    document.getElementById('characterNameDisplay').textContent = characterName;
}

// Función de batalla
function fight() {
    battleCount++; // Incrementa el contador de batallas

    const evolutionMessageElement = document.getElementById('evolutionMessage');
    const spriteElement = document.getElementById('currentSprite');

    // Primer cambio de sprite (cuando llega a 5 batallas)
    if (battleCount === firstEvolution && currentEvolution === 0) {
        // Muestra el mensaje de evolución
        evolutionMessageElement.textContent = 'Evolving...';

        // Cambia el sprite del personaje a la primera evolución con transición suave
        spriteElement.classList.remove('pixelart-to-css1');
        spriteElement.classList.add('pixelart-to-css2');

        // Actualiza el estado de evolución
        currentEvolution = 1;

        // Después de 2 segundos, borra el mensaje de "Evolving..."
        setTimeout(() => {
            evolutionMessageElement.textContent = '';
        }, 2000);

    // Segundo cambio de sprite (cuando llega a 10 batallas)
    } else if (battleCount === secondEvolution && currentEvolution === 1) {
        // Muestra el mensaje de evolución
        evolutionMessageElement.textContent = 'Evolving...';

        // Cambia el sprite del personaje a la segunda evolución con transición suave
        spriteElement.classList.remove('pixelart-to-css2');
        spriteElement.classList.add('pixelart-to-css3');

        // Actualiza el estado de evolución
        currentEvolution = 2;

        // Después de 2 segundos, borra el mensaje de "Evolving..."
        setTimeout(() => {
            evolutionMessageElement.textContent = '';
        }, 2000);

    // Tercer cambio de sprite (cuando llega a 15 batallas)
    } else if (battleCount === thirdEvolution && currentEvolution === 2) {
        // Muestra el mensaje de evolución
        evolutionMessageElement.textContent = 'Evolving...';

        // Cambia el sprite del personaje a la tercera evolución con transición suave
        spriteElement.classList.remove('pixelart-to-css3');
        spriteElement.classList.add('pixelart-to-css4');

        // Actualiza el estado de evolución
        currentEvolution = 3;

        // Después de 2 segundos, borra el mensaje de "Evolving..."
        setTimeout(() => {
            evolutionMessageElement.textContent = '';
        }, 2000);

    // Si aún no ha llegado al valor de evolución, limpia el mensaje
    } else {
        evolutionMessageElement.textContent = '';
    }
}