const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const http = require('http'); // Importar el módulo http

const socketIo = require('socket.io'); // Importar socket.io
const players = {}; // { socketId: { id: characterId, position: { x, y } } }


const fs = require('fs');
const path = require('path');
const characterController = require('./controllers/characterController');
const gameController = require('./controllers/gameController');
const userController = require('./controllers/userController');

const app = express();
const PORT = 3000;

// Crear el servidor HTTP
const server = http.createServer(app);
const io = socketIo(server); // Configurar Socket.IO

// Configuración de vistas
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuración de sesiones
app.use(session({ secret: 'mi_secreto', resave: false, saveUninitialized: true }));

// Middleware para hacer la sesión accesible en las vistas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Rutas de inicio de sesión y registro
app.get('/login', userController.showLoginForm);
app.post('/login', userController.login);
app.get('/register', userController.showRegisterForm);
app.post('/register', userController.register);
app.get('/logout', userController.logout);

// Middleware para proteger las rutas que requieren autenticación
app.use((req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
});

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
app.get('/characters/:id/getPositions', characterController.getPositions); // Nueva ruta para obtener posiciones

// Game routes
app.get('/game', gameController.view);
app.get('/game/select', gameController.select);
app.post('/game/select', gameController.chooseCharacter);
app.put('/game/update', gameController.updateEnergy);
app.get('/players', characterController.showPlayerTable);

// Ruta para la página "Acerca de"
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/map', (req, res) => {
    res.render('map');
});

app.get('/configuration', (req, res) => {
    res.render('configuration');
});

// Rutas para el administrador
app.get('/admin', userController.showAdminPage);
app.post('/admin/:uuid/update', userController.updateUser);
app.post('/admin/:uuid/delete', userController.deleteUser);

app.get('/characterId', (req, res) => {
    if (req.session.userId) {
        // Supongamos que tienes una función que obtiene el personaje por userId
        const characterId = getCharacterIdByUserId(req.session.userId);
        res.json({ id: characterId });
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});

function getCharacterIdByUserId(userId) {
    // Aquí deberías buscar el ID del personaje en tu base de datos o en el JSON
    const charactersFilePath = path.join(__dirname, 'data', 'characters.json');
    const characters = JSON.parse(fs.readFileSync(charactersFilePath, 'utf8'));
    const character = characters.find(c => c.userId === userId);
    return character ? character.id : null;
}

// Iniciar el servidor y el socket
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Configurar sockets
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado:', socket.id);

    // Leer el archivo JSON para obtener todas las posiciones de personajes
    const charactersFilePath = path.join(__dirname, 'data', 'characters.json');
    fs.readFile(charactersFilePath, 'utf8', (err, jsonData) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return;
        }
        const characters = JSON.parse(jsonData);
        // Filtrar solo los que tienen posición
        const playersPositions = characters.map(c => ({ id: c.id, position: c.position }));
        // Emitir las posiciones actuales a este nuevo usuario
        socket.emit('allPlayersPositions', playersPositions);
    });

    // Manejar la actualización de posición
    socket.on('updatePosition', (data) => {
        // Leer el archivo JSON para actualizar posiciones
        fs.readFile(charactersFilePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error('Error al leer el archivo JSON:', err);
                return;
            }
            const characters = JSON.parse(jsonData);
            // Actualizar la posición del personaje correspondiente
            const character = characters.find(c => c.id === data.id);
            if (character) {
                character.position = data.position; // Actualiza la posición
                // Guardar de nuevo en el JSON
                fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), (err) => {
                    if (err) {
                        console.error('Error al guardar el archivo JSON:', err);
                    }
                });
            }
        });

        // Emitir la posición actualizada a todos los demás usuarios
        socket.broadcast.emit('positionUpdated', data);
    });

    // Manejar la desconexión del socket
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });

    // Manejar la recepción de un mensaje de chat
    socket.on('chatMessage', (data) => {
        // Emitir el mensaje a todos los demás jugadores
        socket.broadcast.emit('chatMessage', data); // Enviar a todos menos al emisor
    });

    // Manejar la desconexión del socket
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
 
});

