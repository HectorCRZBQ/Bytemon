const userModel = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

// Mostrar el formulario de inicio de sesión
exports.showLoginForm = (req, res) => {
    res.render('login', { loadUserCss: true, error: null, page: 'login' }); // Pasar la variable 'page'
};

// Manejar el inicio de sesión
exports.login = (req, res) => {
    const { username, password } = req.body;
    const user = userModel.findUserByUsername(username);

    if (user && user.password === password) {
        req.session.userId = user.uuid; // Usar un UUID para el usuario
        res.redirect('/characters'); // Redirigir a la página de personajes
    } else {
        res.render('login', { loadUserCss: true, error: 'Usuario o contraseña incorrectos.', page: 'login' }); // Asegúrate de pasar 'page' aquí
    }
};

// Mostrar el formulario de registro
exports.showRegisterForm = (req, res) => {
    res.render('register', { loadUserCss: true, error: null, page: 'register' }); // Pasar la variable 'page'
};

// Manejar la creación de cuentas
exports.register = (req, res) => {
    const { newUsername, newPassword } = req.body;

    if (!userModel.findUserByUsername(newUsername)) {
        const newUser = {
            username: newUsername,
            password: newPassword,
            uuid: uuidv4() // Generar un UUID para el nuevo usuario
        };
        userModel.addUser(newUser);
        res.redirect('/login'); // Redirigir al formulario de inicio de sesión
    } else {
        res.render('register', { loadUserCss: true, error: 'El nombre de usuario ya existe.', page: 'register' }); // Asegúrate de pasar 'page' aquí
    }
};



