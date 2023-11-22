const { users } = require('../../models'); // Ganti dengan path yang benar ke file models/users.js

// Ambil data dari SQLite
const getUser = async () => {
    try {
        const usersData = await users.findAll();
        return usersData;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
};

module.exports = {
    getUser
};