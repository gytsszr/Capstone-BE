const { users } = require('../../models'); 
const CryptoJS = require('crypto-js');

const decryptData = (ciphertext, key) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
//TBC
const resume = async (request, h) => {
    const token = request.headers['token'];
    const {
        resume
    } = request.payload;
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
        user.resume = resume;
        await user.save();
        return h.response({message: "Success Adding Resume"}).code(200);
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err}).code(400);
    }
}

const getResume = async (request, h) => {
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
        return h.response({ resume: user.resume}).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err}).code(400);
    }
}
const deleteResume = async (request, h) => {
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
        user.resume = null;
        await user.save();
        return h.response({ message: "Success Deleting Resume" }).code(200);

    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        return h.response({ message: 'Validation Error', err}).code(400);
    }
}
module.exports = {
    getResume,
    resume,
    deleteResume
};