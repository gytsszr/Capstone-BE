const { users } = require('../../models'); // Ganti dengan path yang benar ke file models/users.js
const CryptoJS = require('crypto-js');

const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (ciphertext, key) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

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

const createUser = async (request, h) => {
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

        return h.response({ message: 'Success Register' }).code(200);
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error' }).code(400);
    }
}

const loginUser = async (request, h) => {
    const {
        email, 
        password,
    } = request.payload;

    try {
        // Mencari user di database berdasarkan email dan password
        const user = await users.findOne({
            where: {
                email: email,
                password: password,
            }
        });

        if (!user) {
            return h.response({ message: 'Validation Error' }).code(400);
        }

        // Mengenkripsi data user
        const key = 'Jobsterific102723'; // Ganti dengan kunci rahasia Anda

        const encryptedData = encryptData({
            email: user.email,
            password: user.password,
            firstName: user.firstName
        }, key);

        // Menyimpan token ke database
        user.token = encryptedData;
        await user.save();

        // Mengembalikan data terenkripsi
        return h.response({ message: `Success Login`, user}).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error' }).code(400);
    }
}

const getCurrentUser = async (request, h) => {
    const token = request.headers['token'];
    try {
        // Mendekripsi token untuk mendapatkan data pengguna
        const key = 'Jobsterific102723'; // Ganti dengan kunci rahasia Anda
        const userData = decryptData(token, key);
        // Mencari user di database berdasarkan email dan password

        const user = await users.findOne({
            where: {
                email: userData.email,
            }
        });

        if (!user && user.email != userData.email) {
            return h.response({ message: 'Validation Error' }).code(400);
        }
        // Mengembalikan data pengguna
        return h.response({
            user
        }).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err}).code(400);
    }
}


const logoutUser = async (request, h) => {
    const token = request.headers['token'];

    try {
        const user = await users.findOne({
            where: {
                token : token
            }
        });

        if (!user) {
            return h.response({ message: 'Validation Error' }).code(400);
        }

        // Menghapus token dari database
        user.token = null;
        await user.save();

        return h.response({ message: 'Success LogOut' }).code(200);
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err}).code(400);
    }
}

module.exports = {
    getUser, 
    createUser, 
    loginUser,
    getCurrentUser,
    logoutUser,
};