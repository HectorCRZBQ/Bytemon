// characterModel.js
const fs = require('fs');
const path = './data/characters.json';

const getAllCharacters = () => {
    try {
        const data = fs.readFileSync(path, 'utf-8');
        const characters = JSON.parse(data);

        // Asegurar que cada personaje tenga el campo 'position'
        characters.forEach(character => {
            if (!character.position) {
                character.position = { x: 0, y: 0 }; // Valor por defecto
            }
        });

        return characters;
    } catch (error) {
        console.error('Error al cargar los personajes:', error);
        return [];
    }
};

const saveCharacters = (characters) => {
    try {
        fs.writeFileSync(path, JSON.stringify(characters, null, 2));
    } catch (error) {
        console.error('Error al guardar los personajes:', error);
    }
};

const findCharacterById = (id) => {
    try {
        const characters = getAllCharacters();
        return characters.find(c => c.id === id) || null;
    } catch (error) {
        console.error('Error finding character by ID:', error);
        return null;
    }
};

// Nueva función para re-numerar los IDs de los personajes
const renumberCharacterIds = () => {
    const characters = getAllCharacters();
    const renumbered = characters.map((character, index) => ({
        ...character,
        id: index + 1 // Asigna un nuevo ID basado en el índice
    }));
    saveCharacters(renumbered); // Guarda la lista renumerada
};

const saveCharacter = (updatedCharacter) => {
    const characters = getAllCharacters();
    const index = characters.findIndex(c => c.id === updatedCharacter.id);
    if (index !== -1) {
        characters[index] = updatedCharacter;
        saveCharacters(characters);
    }
};

module.exports = { 
    getAllCharacters, 
    saveCharacters, 
    findCharacterById, 
    saveCharacter, 
    renumberCharacterIds 
};