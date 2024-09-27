const characterModel = require('../models/characterModel');

exports.index = (req, res) => {
    const characters = characterModel.getAllCharacters();
    res.render('characters/index', { characters });
};

exports.create = (req, res) => {
    res.render('characters/create', { loadFormCss: true });
};

exports.store = (req, res) => {
    const characters = characterModel.getAllCharacters();
    const newCharacter = {
        id: characters.length + 1,
        name: req.body.name,
        energyLevel: req.body.energyLevel,
        lifeExpectancy: req.body.lifeExpectancy,
        team: req.body.team,
        initial: req.body.initial
    };
    characters.push(newCharacter);
    characterModel.saveCharacters(characters);
    res.redirect('/characters');
};

exports.edit = (req, res) => {
    const character = characterModel.findCharacterById(parseInt(req.params.id));
    res.render('characters/edit', { character, loadFormCss: true });
};

exports.update = (req, res) => {
    let characters = characterModel.getAllCharacters();
    const characterIndex = characters.findIndex(c => c.id === parseInt(req.params.id));
    if (characterIndex >= 0) {
        characters[characterIndex] = { ...characters[characterIndex], ...req.body };
        characterModel.saveCharacters(characters);
    }
    res.redirect('/characters');
};

exports.delete = (req, res) => {
    let characters = characterModel.getAllCharacters();
    characters = characters.filter(c => c.id !== parseInt(req.params.id));
    characterModel.saveCharacters(characters);
    res.redirect('/characters');
};