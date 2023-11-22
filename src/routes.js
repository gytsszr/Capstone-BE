//routes boleh diisi disini yaa
const {getUser, register} = require('./user/handler');
const routes = [
    //user
    {
        method: 'GET',
        path: "/",
        handler: getUser
    },
    {
        method: 'POST',
        path: "/addUser",
        handler: register
    },
    //costumer uncomment code dibawah
    // {
    //     method: 'GET'
    // },
    //admin,
    // {

    // }
];

module.exports = routes;