const fs = require('fs');
const path = require('path');
const characterModel = require('../models/characterModel');

exports.index = (req, res) => {
    const characters = characterModel.getAllCharacters();
    const userId = req.session.userId; // Obtener el ID del usuario logueado

    // Filtrar personajes por el ID del usuario que los creó
    const userCharacters = characters.filter(character => character.userId === userId);

    res.render('characters/index', { characters: userCharacters, loadIndexCss: true });
};

exports.create = (req, res) => {
    res.render('characters/create', { loadFormCss: true });
};

exports.store = (req, res) => {
    const characters = characterModel.getAllCharacters();

    const newCharacter = {
        id: characters.length > 0 ? characters[characters.length - 1].id + 1 : 1, // Generar un nuevo ID automáticamente
        name: req.body.name,
        energyLevel: parseInt(req.body.energyLevel, 10), 
        lifePoints: parseInt(req.body.lifePoints, 10),
        team: req.body.team,
        initial: req.body.initial,
        userId: req.session.userId // Asegúrate de que el ID del usuario se esté almacenando aquí
    };

    characters.push(newCharacter);
    characterModel.saveCharacters(characters);
    res.redirect('/characters');
};

exports.edit = (req, res) => {
    const character = characterModel.findCharacterById(parseInt(req.params.id));
    
    // Verificar si el usuario logueado es el creador del personaje
    if (!character || character.userId !== req.session.userId) {
        return res.status(403).send('No tienes permiso para editar este personaje.');
    }

    res.render('characters/edit', { character, loadFormCss: true });
};

exports.update = (req, res) => {
    let characters = characterModel.getAllCharacters();
    const characterIndex = characters.findIndex(c => c.id === parseInt(req.params.id));

    if (characterIndex >= 0 && characters[characterIndex].userId === req.session.userId) {
        characters[characterIndex] = {
            ...characters[characterIndex],
            ...req.body
        };
        characters[characterIndex].lifePoints = parseInt(req.body.lifePoints, 10); // Asegúrate de convertirlo a número
        characterModel.saveCharacters(characters);
    }

    res.redirect('/characters');
};

exports.delete = (req, res) => {
    let characters = characterModel.getAllCharacters();
    const characterIndex = characters.findIndex(c => c.id === parseInt(req.params.id));

    // Verificar si el usuario logueado es el creador del personaje
    if (characterIndex >= 0 && characters[characterIndex].userId === req.session.userId) {
        characters = characters.filter(c => c.id !== parseInt(req.params.id));
        characterModel.saveCharacters(characters);
        characterModel.renumberCharacterIds(); // Renumerar los IDs después de eliminar
    }

    res.redirect('/characters');
};

// Mostrar la tabla de jugadores con personajes y usuarios
exports.showPlayerTable = (req, res) => {
    const characters = characterModel.getAllCharacters();
    const userId = req.session.userId; // Obtener el ID del usuario logueado

    // Filtrar personajes por el ID del usuario que los creó
    const userCharacters = characters.filter(character => character.userId === userId);

    // Leer datos de usuarios desde users.json
    const usersFilePath = path.join(__dirname, '../data/users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Renderizar la vista 'playerTable' pasando ambos personajes y usuarios
    res.render('characters/playerTable', { characters: userCharacters, users, loadTableCss: true });
};

exports.about = (req, res) => {
    res.render('about', { loadAboutCss: true });
};
