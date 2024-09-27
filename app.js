const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const characterController = require('./controllers/characterController');
const gameController = require('./controllers/gameController'); 
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Permitir JSON en el cuerpo de las solicitudes
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
    res.redirect('/game');
});

// CRUD routes for characters
app.get('/characters', characterController.index);
app.get('/characters/new', characterController.create);
app.post('/characters', characterController.store);
app.get('/characters/:id/edit', characterController.edit);
app.post('/characters/:id/update', characterController.update);
app.post('/characters/:id/delete', characterController.delete);

// Game routes
app.get('/game', gameController.view);
app.get('/game/select', gameController.select);
app.post('/game/select', gameController.chooseCharacter);
app.put('/game/update', gameController.updateEnergy); 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
