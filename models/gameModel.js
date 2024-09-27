const fs = require('fs');
const path = './data/gameState.json';

// Obtener el estado del juego desde el archivo binario
const getGameState = () => {
    if (fs.existsSync(path)) {
        try {
            const data = fs.readFileSync(path);
            if (data.length === 0) {
                const defaultState = { characterId: null };
                saveGameState(defaultState);
                return defaultState;
            }
            return JSON.parse(data.toString());
        } catch (error) {
            console.error("Error al leer el estado del juego:", error);
            const defaultState = { characterId: null };
            saveGameState(defaultState);
            return defaultState;
        }
    } else {
        const defaultState = { characterId: null };
        saveGameState(defaultState);
        return defaultState;
    }
};

// Guardar el estado del juego en el archivo binario
const saveGameState = (state) => {
    fs.writeFileSync(path, Buffer.from(JSON.stringify(state)));
};

module.exports = { getGameState, saveGameState };
