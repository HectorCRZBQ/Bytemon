const characterModel = require('../models/characterModel');
const gameModel = require('../models/gameModel');
// Mostrar la página de selección de personajes
exports.select = (req, res) => {
    const characters = characterModel.getAllCharacters();
    res.render('characters/select', { characters });
};
// Manejar la selección de un personaje para el juego
exports.chooseCharacter = (req, res) => {
    const gameState = gameModel.getGameState();
    gameState.characterId = parseInt(req.body.characterId);
    gameModel.saveGameState(gameState);
    res.redirect('/game');
};
// Mostrar la vista del juego
exports.view = (req, res) => {
    const gameState = gameModel.getGameState();
    const character = characterModel.findCharacterById(gameState.characterId);
    res.render('game', { character });
};
// Actualizar el nivel de vida (REST API)
exports.updateEnergy = (req, res) => {
    const gameState = gameModel.getGameState();
    const character = characterModel.findCharacterById(gameState.characterId);
    const action = req.body.action;
    
    switch (action) {        
        case 'sound': // Emitir sonido
            break;
            
        case 'attack': //Dar de comer
            character.energyLevel = Math.max(0, character.energyLevel - 20);
            character.lifePoints = Math.max(0, character.lifePoints - 25);  
            break;
            
        case 'attackCharged': //Dar de comer
            character.energyLevel = Math.max(0, character.energyLevel - 50);
            character.lifePoints = Math.max(0, character.lifePoints - 50);  
            break;
            
        case 'feedBerry': //Curar con baya
            character.energyLevel = Math.min(300, character.energyLevel + 15);
            character.lifePoints = Math.min(250, character.lifePoints + 10);
            break;
            
        case 'feedPotion': //Curar con poción
            character.energyLevel = Math.min(300, character.energyLevel + 10);
            character.lifePoints = Math.min(250, character.lifePoints + 10);
            break;
        default:
            return res.status(400).json({ message: 'Acción no válida' });
    }
    characterModel.saveCharacter(character); // Guardar el estado actualizado del personaje
    res.json({ 
        energyLevel: character.energyLevel, 
        lifePoints: character.lifePoints 
    });
};