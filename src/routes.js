//routes boleh diisi disini yaa
const {getUser} = require('./user/handler');
const routes = [
    //user
    {
        method: 'GET',
        path: "/",
        handler: getUser
    },
    //costumer uncomment code dibawah
    // {

    // },
    //admin,
    // {

    // }
];

module.exports = routes;