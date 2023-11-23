//routes boleh diisi disini yaa
const {getUser, register} = require('./user/handler');
const {
  getUser,
  register,
  getCustomers,
  getCustomerById,
  updateCustomer,
} = require("./customer/handler");
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
        method: "GET",
        path: "/customers",
        handler: getCustomers,
    },
    {
        method: "POST",
        path: "/customers/register",
        handler: register,
    },
    {
        method: "GET",
        path: "/customers/:id_customer",
        handler: getCustomerById,
    },
    {
        method: "PUT",
        path: "/customers/:id_customer",
        handler: updateCustomer,
    },
    //admin,
    // {

    // }
];

module.exports = routes;
