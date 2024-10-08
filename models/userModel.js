const fs = require('fs');
const path = './data/users.json';

// Obtener todos los usuarios
const getAllUsers = () => {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        return JSON.parse(data);
    }
    return [];
};

// Agregar un nuevo usuario
const addUser = (user) => {
    const users = getAllUsers();
    users.push(user);
    fs.writeFileSync(path, JSON.stringify(users, null, 2));
};

// Buscar un usuario por nombre de usuario
const findUserByUsername = (username) => {
    const users = getAllUsers();
    return users.find(user => user.username === username);
};

module.exports = { addUser, findUserByUsername };
