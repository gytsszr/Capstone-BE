const { customers } = require('./customer/handler'); // Ganti dengan path yang benar ke file models/users.js

// Ambil data dari SQLite
const getCustomer = async () => {
    try {
        const customersData = await customers.findAll();
        return customersData;
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
        address,
        website,
        description
    } = request.payload;

    try {
        // Membuat customer baru dan menyimpannya ke database
        const newCustomer = await customers.create({
            firstName, 
            lastName, 
            email, 
            password, 
            job, 
            sex, 
            address,
            website,
            description
        });

        // Mengembalikan data customer yang baru dibuat
        return newCustomer;
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        throw err;
    }
}

module.exports = {
    getCustomer, register
};
