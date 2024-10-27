const express = require('express');
const session = require('express-session'); // Para manejar sesiones
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const characterController = require('./controllers/characterController');
const gameController = require('./controllers/gameController');
const userController = require('./controllers/userController');
const app = express();
const PORT = 3000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Permitir JSON en el cuerpo de las solicitudes
app.use(express.static('public')); // Para archivos estáticos

// Configuración de sesiones
app.use(session({ secret: 'mi_secreto', resave: false, saveUninitialized: true }));

// Middleware para hacer la sesión accesible en las vistas
app.use((req, res, next) => {
    res.locals.session = req.session; // Hacer la sesión accesible en las vistas
    next();
});

// Rutas de inicio de sesión y registro
app.get('/login', (req, res) => {
    res.render('login', { loadUserCss: true, error: null, page: 'login' }); // Pasar la variable 'page'
}); // Mostrar el formulario de inicio de sesión
app.post('/login', userController.login); // Manejar el inicio de sesión

app.get('/register', (req, res) => {
    res.render('register', { loadUserCss: true, error: null, page: 'register' }); // Pasar la variable 'page'
}); // Mostrar el formulario de registro
app.post('/register', userController.register); // Manejar el registro de usuarios

// Rutas de cierre de sesión
app.get('/logout', userController.logout);
app.get('/logout', (req, res) => {
    const userId = req.session.userId;
    if (userId) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/'); // Manejar el error
            }
            res.clearCookie('connect.sid', { path: '/' }); // Limpiar la cookie de la pestaña actual
            res.redirect('/login'); // Redirigir a la página de login
        });
    }
});

// Middleware para proteger las rutas que requieren autenticación
app.use((req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirigir si no está autenticado
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

// Game routes
app.get('/game', gameController.view);
app.get('/game/select', gameController.select);
app.post('/game/select', gameController.chooseCharacter);
app.put('/game/update', gameController.updateEnergy);

// Table routes
app.get('/players', characterController.showPlayerTable);

// Ruta para la página "Acerca de"
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/map', (req, res) => {
    res.render('map');
});

// Ruta para la pagina de configuracion
app.get('/configuration', (req, res) => {
    res.render('configuration')
});

// Rutas para el administrador
app.get('/admin', (req, res) => {
    if (req.session.isAdmin) {
        userController.showAdminPage(req, res);
    } else {
        res.redirect('/'); // Redirigir a la raíz si no es admin
    }
});

app.post('/admin/:uuid/update', userController.updateUser); // Actualizar usuario
app.post('/admin/:uuid/delete', userController.deleteUser); // Eliminar usuario

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});