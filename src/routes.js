//routes boleh diisi disini yaa
const {getUser} = require('./user/handler');
const routes = [
    {
        method: 'GET',
        path: "/",
        handler: getUser
    },
];

module.exports = routes;