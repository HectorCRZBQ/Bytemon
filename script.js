function changeCharacterName() {
    // Captura el valor del input
    const characterName = document.getElementById('characterNameInput').value;

    // Asigna el nombre ingresado al elemento que muestra el nombre del personaje
    document.getElementById('characterNameDisplay').textContent = characterName;
}