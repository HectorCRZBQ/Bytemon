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
    loadUsers();
    users.push(newUser);
    saveUsers();
};

// Actualizar usuario por UUID
exports.updateUser = (uuid, updatedData) => {
    loadUsers();
    const index = users.findIndex(u => u.uuid === uuid);
    if (index !== -1) {
        users[index] = { ...users[index], ...updatedData }; // Actualiza el usuario con los nuevos datos
        saveUsers();
    }
};

// Eliminar usuario por UUID
exports.deleteUser = (uuid) => {
    loadUsers();
    users = users.filter(user => user.uuid !== uuid);
    saveUsers();
};

// Encontrar usuario por nombre de usuario
exports.findUserByUsername = (username) => {
    loadUsers();
    return users.find(user => user.username === username);
};

// Exportar la lista de usuarios
exports.getAllUsers = () => {
    loadUsers();
    return users;
};

// Actualizar la conexión del usuario
exports.updateUserConnection = (uuid, isConnected) => {
    loadUsers();
    const user = users.find(u => u.uuid === uuid);
    if (user) {
        user.isConnected = isConnected;
        if (isConnected) {
            user.lastLogin = new Date().toISOString(); // Actualizar última conexión
        }
        saveUsers();
    }
};
