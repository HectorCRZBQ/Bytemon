const fs = require('fs');
const path = './data/characters.json';

const getAllCharacters = () => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
};

const saveCharacters = (characters) => {
    try {
        fs.writeFileSync(path, JSON.stringify(characters, null, 2));
    } catch (error) {
        console.error('Error al guardar los personajes:', error);
    }
};

const findCharacterById = (id) => {
    const characters = getAllCharacters();
    return characters.find(c => c.id === id);
};

const saveCharacter = (updatedCharacter) => {
    const characters = getAllCharacters();
    const index = characters.findIndex(c => c.id === updatedCharacter.id);
    if (index !== -1) {
        characters[index] = updatedCharacter;
        saveCharacters(characters);
    }
};

module.exports = { getAllCharacters, saveCharacters, findCharacterById, saveCharacter };
