// userController.js
const fs = require('fs');
const path = require('path');
const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

// Mostrar el formulario de inicio de sesión
exports.showLoginForm = (req, res) => {
    res.render('login', { loadUserCss: true, error: null, page: 'login' });
};

// Manejar el inicio de sesión
exports.login = (req, res) => {
    const { username, password } = req.body;
    const user = userModel.findUserByUsername(username);

    if (user && user.password === password) {
        req.session.userId = user.uuid;

        // Actualizar el campo lastLogin y el estado de conexión del usuario
        userModel.updateUserConnection(user.uuid, true); // Marcar como conectado
        user.lastLogin = new Date().toISOString(); // Actualizar lastLogin también

        res.redirect('/characters'); // Redirigir a la página de personajes
    } else {
        res.render('login', { loadUserCss: true, error: 'Usuario o contraseña incorrectos.', page: 'login' });
    }
};

// Mostrar el formulario de registro
exports.showRegisterForm = (req, res) => {
    res.render('register', { loadUserCss: true, error: null, page: 'register' });
};

// Manejar la creación de cuentas
exports.register = (req, res) => {
    const { newUsername, newPassword } = req.body;

    if (!userModel.findUserByUsername(newUsername)) {
        const newUser = {
            username: newUsername,
            password: newPassword,
            uuid: uuidv4(), // Generar un UUID para el nuevo usuario
            lastLogin: null, // Inicialmente, no hay fecha de último inicio de sesión
            isConnected: false // Inicialmente no está conectado
        };
        userModel.addUser(newUser);
        res.redirect('/login'); // Redirigir al formulario de inicio de sesión
    } else {
        res.render('register', { loadUserCss: true, error: 'El nombre de usuario ya existe.', page: 'register' });
    }
};

// Manejar la conexión de un usuario
exports.connectUser = (req, res) => {
    const userId = req.session.userId; // Obtener ID de sesión
    if (userId) {
        userModel.updateUserConnection(userId, true); // Marcar como conectado
    }
};

// Manejar la desconexión de un usuario
exports.disconnectUser = (req, res) => {
    const userId = req.session.userId; // Obtener ID de sesión
    if (userId) {
        userModel.updateUserConnection(userId, false); // Marcar como desconectado
    }
};

// Función para mostrar la tabla de jugadores
exports.showPlayerTable = (req, res) => {
    const usersFilePath = path.join(__dirname, '../data/users.json'); // Ruta al archivo users.json
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')); // Leer el archivo

    // Renderizar la vista playerTable con los datos de los usuarios
    res.render('characters/playerTable', { users });
};

exports.logout = (req, res) => {
    const userId = req.session.userId;
    if (userId) {
        userModel.updateUserConnection(userId, false); // Marcar como desconectado
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/'); // Manejar el error adecuadamente
            }
            res.clearCookie('connect.sid', { path: '/' });
            res.redirect('/login'); // Redirigir al formulario de login
        });
    }
};
