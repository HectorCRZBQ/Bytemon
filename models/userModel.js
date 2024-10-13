// userModel.js
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

let users = [];

// Cargar los usuarios desde el archivo JSON al inicio
const loadUsers = () => {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(data);
    }
};

// Guardar los usuarios en el archivo JSON
const saveUsers = () => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Agregar un nuevo usuario
exports.addUser = (newUser) => {
    loadUsers(); // Cargar usuarios antes de agregar
    users.push(newUser); // Agregar nuevo usuario
    saveUsers(); // Guardar cambios en el archivo
};

// Encontrar usuario por nombre de usuario
exports.findUserByUsername = (username) => {
    loadUsers(); // Cargar usuarios antes de buscar
    return users.find(user => user.username === username);
};

// Exportar la lista de usuarios
exports.getAllUsers = () => {
    loadUsers(); // Cargar usuarios antes de devolver
    return users;
};

// Actualizar la conexión del usuario
exports.updateUserConnection = (uuid, isConnected) => {
    loadUsers(); // Cargar usuarios antes de actualizar
    const user = users.find(u => u.uuid === uuid);
    if (user) {
        user.isConnected = isConnected; // Actualizar estado de conexión
        if (isConnected) {
            user.lastLogin = new Date().toISOString(); // Actualizar última conexión
        }
        saveUsers(); // Guardar cambios
    }
};
