//routes boleh diisi disini yaa
const {getUser, createUser, loginUser, getCurrentUser, logoutUser} = require('./user/handler');
const {
  getCustomer,
  registerCustomer,
  loginCustomer,
  getCustomerById,
  updateCustomer,
  getResume,
  applyBatch,
  getBatches,
  getBatch,
  customerLogout,
} = require("./customer/handler");
const {
  registerAdmin,
  loginAdmin,
  getCustomers,
  registerBatch,
  getApplyments,
  getApplyment,
  logoutAdmin,
} = require("./admin/handler");

const routes = [
    //user
    {
        method: 'GET',
        path: '/',
        handler: getUser
    },
    {
        // CreateNew User API
        method: 'POST',
        path: "/api/users",
        handler: createUser
    },
    {
        // Login
        method: 'POST',
        path: "/api/users/login",
        handler: loginUser
    },
    {
        //Get User
        method: 'GET',
        path: "/api/users",
        handler: getCurrentUser
    },
    {
        method: 'PUT',
        path: "/api/users/current",
        handler: getCurrentUser
        // TBC
    },
    {
        // Logout User
        method: 'DELETE',
        path: "/api/users/logout",
        handler: logoutUser
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
    {
        method: "GET",
        path: "/customers/:id_customer",
        handler: getResume,
    },
    {
        method: "POST",
        path: "/customers/logout",
        handler: customerLogout,
    },
    //admin,
    {
        method: "POST",
        path: "/api/admins",
        handler: registerAdmin,
    },
    {
        method: "POST",
        path: "/api/admins/login",
        handler: loginAdmin,
    },
    {
        method: "GET",
        path: "/api/admins/customers",
        handler: getCustomers,
     },
     {
        method: "POST",
        path: "/api/admins/batches",
        handler: registerBatch,
     },
     {
        method: "GET",
        path: "/api/admins/applyments",
        handler: getApplyments,
      },
      {
        method: "GET",
        path: "/api/admins/applyments/:applyId",
        handler: getApplyment,
      },
      {
        method: "POST",
        path: "/api/admins/logout",
        handler: logoutAdmin,
      },
];

module.exports = routes;
