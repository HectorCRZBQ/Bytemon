const fs = require('fs');
const path = require('path');
const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt'); // añado la libreria bcypt para hashear la contraseña

// Mostrar el formulario de inicio de sesión
exports.showLoginForm = (req, res) => {
    res.render('login', { loadUserCss: true, error: null, page: 'login' });
};

// Manejar el inicio de sesión
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = userModel.findUserByUsername(username);

    if (user) {
        // Usar bcrypt para comparar la contraseña proporcionada con la hasheada
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.userId = user.uuid;
            req.session.isAdmin = username === 'admin' && password === 'admin'; // Identificar si es admin

            userModel.updateUserConnection(user.uuid, true); // Marcar como conectado
            user.lastLogin = new Date().toISOString(); // Actualizar lastLogin también

            if (req.session.isAdmin) {
                res.redirect('/admin'); // Si es admin, redirigir a la página de administración
            } else {
                res.redirect('/characters'); // Redirigir a la página de personajes
            }
        } else {
            res.render('login', { loadUserCss: true, error: 'Usuario o contraseña incorrectos.', page: 'login' });
        }
    } else {
        res.render('login', { loadUserCss: true, error: 'Usuario o contraseña incorrectos.', page: 'login' });
    }
};

// Mostrar el formulario de registro
exports.showRegisterForm = (req, res) => {
    res.render('register', { loadUserCss: true, error: null, page: 'register' });
};

exports.register = async (req, res) => {
    const { newUsername, newPassword } = req.body;

    // Comprobar si el usuario ya existe
    if (!userModel.findUserByUsername(newUsername)) {
        try {
            // Generar el hash de la contraseña
            const saltRounds = 10; // El número de salt rounds (incrementa la seguridad de la contraseña)
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds); // Hashear la contraseña de forma asíncrona

            const newUser = {
                username: newUsername,
                password: hashedPassword, // Guardar la contraseña hasheada
                uuid: uuidv4(), // Generar un UUID para el nuevo usuario
                lastLogin: null, // Inicialmente, no hay fecha de último inicio de sesión
                isConnected: false // Inicialmente no está conectado
            };

            // Agregar el usuario al modelo
            userModel.addUser(newUser);

            // Redirigir al formulario de inicio de sesión
            res.redirect('/login');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error al registrar el usuario');
        }
    } else {
        // Si el usuario ya existe, renderizar el formulario con un error
        res.render('register', { loadUserCss: true, error: 'El nombre de usuario ya existe.', page: 'register' });
    }
};

// Mostrar la página de administración para el usuario "admin"
exports.showAdminPage = (req, res) => {
    if (!req.session.isAdmin) {
        return res.redirect('/'); // Redirigir si no es admin
    }
    const users = userModel.getAllUsers(); // Obtener todos los usuarios
    res.render('admin', { users, loadAdminCss: true });
};

// Manejar la actualización de usuarios
exports.updateUser = (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).send('Acceso no autorizado');
    }
    const { username, password } = req.body;
    const userId = req.params.uuid;
    userModel.updateUser(userId, { username, password });
    res.redirect('/admin');
};

// Manejar la eliminación de usuarios
exports.deleteUser = (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).send('Acceso no autorizado');
    }
    const userId = req.params.uuid;
    userModel.deleteUser(userId);
    res.redirect('/admin');
};

// Manejar la desconexión de un usuario
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
