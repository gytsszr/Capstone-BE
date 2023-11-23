//routes boleh diisi disini yaa
const {getUser, register} = require('./user/handler');
const {getCustomer, register} = require('./customer/handler');
const routes = [
    //user
    {
        method: 'GET',
        path: "/",
        handler: getUser
    },
    {
        method: 'GET',
        path: "/api/users",
        handler: getUser
        // TBC
    },
    {
        method: 'POST',
        path: "/api/users/login",
        handler: getUser
        // TBC
    },
    {
        method: 'PUT',
        path: "/api/users/current",
        handler: getUser
        // TBC
    },
    {
        method: 'DELETE',
        path: "/api/users/logout",
        handler: getUser
        // TBC
    },
    {
        method: 'POST',
        path: "/api/users/resume",
        handler: getUser
        // TBC
    },
    {
        method: 'PUT',
        path: "/api/users/resume",
        handler: getUser
    },
    {
        method: 'GET',
        path: "/api/users/resume",
        handler: getUser
    },
    {
        method: 'DELETE',
        path: "/api/users/resume",
        handler: getUser
    },
    {
        method: 'POST',
        path: "/api/applyment",
        handler: getUser
    },
    {
        method: 'GET',
        path: "/api/applyment",
        handler: getUser
    },
    {
        method: 'DELETE',
        path: "/api/applyment",
        handler: getUser
    },
    //costumer
    {
        method: 'GET',
        path: "/api/customers",
        handler: getCustomer
    },
    {
        method: 'GET',
        path: "/api/customers",
        handler: getCustomer
    }
    //admin,
    // {

    // }
];

module.exports = routes;
