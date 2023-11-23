const { users } = require('../../models'); 
const CryptoJS = require('crypto-js');

const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (ciphertext, key) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

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
        const user = await users.findOne({
            where: {
                email: email,
                password: password,
            }
        });

        if (!user) {
            return h.response({ message: 'Validation Error' }).code(400);
        }

        const key = 'Jobsterific102723';
        const encryptedData = encryptData({
            email: user.email,
            password: user.password,
            firstName: user.firstName
        }, key);

        user.token = encryptedData;
        await user.save();

        return h.response({ message: `Success Login`, user}).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error' }).code(400);
    }
}

const getCurrentUser = async (request, h) => {
    const token = request.headers['token'];
    try {
        const key = 'Jobsterific102723';
        const userData = decryptData(token, key);

        const user = await users.findOne({
            where: {
                email: userData.email,
            }
        });
        if (!user && user.email != userData.email) {
            return h.response({ message: 'Validation Error' }).code(400);
        }
        return h.response({
            user
        }).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err}).code(400);
    }
}

const updateUser = async (request, h) => {
    const token = request.headers['token'];
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
        const key = 'Jobsterific102723';
        const userData = decryptData(token, key);

        const user = await users.findOne({
            where: {
                token: token,
            }
        });

        if (!user) {
            return h.response({ message: 'Validation Error' }).code(400);
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        user.job = job;
        user.sex = sex;
        user.address = address;
        await user.save();

        return h.response({ message: 'Success Update User' , user}).code(200);
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error' }).code(400);
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
    updateUser,
    logoutUser,
};