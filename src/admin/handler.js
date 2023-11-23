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

const register = async (request, h) => {
    const {
        firstName, 
        lastName, 
        email, 
        password, 
        job, 
        sex, 
        address 
    } = request.payload;

    try {
        // Membuat user baru dan menyimpannya ke database
        const newUser = await users.create({
            firstName, 
            lastName, 
            email, 
            password, 
            job, 
            sex, 
            address
        });

        // Mengembalikan data user yang baru dibuat
        return newUser;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
}

module.exports = {
    getUser, register
};
