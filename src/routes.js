//routes boleh diisi disini yaa
const {getUser} = require('./user/handler');
const routes = [
    {
        method: 'GET',
        path: "/",
        handler: async (request, h) => {
            try {
                const [results, fields] = await connection.execute('SELECT * FROM user');
                console.log(results);
                return results; // Mengembalikan hasil query sebagai respons
            } catch (error) {
                console.error('Error executing query:', error);
                return h.response({
                    status: 'error',
                    message: 'Terjadi kesalahan pada server',
                    error: error.message,
                }).code(500);
            }
        },
    },
];

module.exports = routes;