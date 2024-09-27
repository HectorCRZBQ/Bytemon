const fs = require('fs');
const path = './data/characters.json';

// Obtener todos los personajes
const getAllCharacters = () => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
};

// Guardar todos los personajes
const saveCharacters = (characters) => {
    fs.writeFileSync(path, JSON.stringify(characters, null, 2));
};

// Buscar un personaje por su ID
const findCharacterById = (id) => {
    const characters = getAllCharacters();
    return characters.find(c => c.id === id);
};

// Guardar un personaje específico
const saveCharacter = (updatedCharacter) => {
    const characters = getAllCharacters();
    const index = characters.findIndex(c => c.id === updatedCharacter.id);
    if (index !== -1) {
        characters[index] = updatedCharacter;
        saveCharacters(characters);
    }
};

module.exports = { getAllCharacters, saveCharacters, findCharacterById, saveCharacter };
