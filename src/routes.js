//routes boleh diisi disini yaa
const {getUser, createUser, loginUser, getCurrentUser, logoutUser} = require('./user/handler');
const {
  registerCustomers,
  getCustomers,
  getCustomerById,
  updateCustomer,
  getResume,
  customerLogout,
} = require("./customer/handler");

const {
    getCandidates,updateCandidate,updateCandidatePassword,
    updateCandidateStatus,deleteCandidate,
    adminCreateCustomer,adminGetCustomers,adminUpdateCustomer,adminDeleteCustomer,
    createBatch,getBatches,updateBatch,deleteBatch,
  } = require('./admin/handler');
  
  

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
        path: "/api/customers",
        handler: getCustomers,
    },
    {
        method: "POST",
        path: "/api/customers/register",
        handler: register,
    },
    {
        method: "GET",
        path: "/api/customers/:id_customer",
        handler: getCustomerById,
    },
    {
        method: "PUT",
        path: "/api/customers/:id_customer",
        handler: updateCustomer,
    },
    {
        method: "GET",
        path: "/api/customers/resume/",
        handler: getResume,
    },
    {
        method: "POST",
        path: "/api/customers/logout",
        handler: customerLogout,
    },
    
    
    
    
    //admin,
    // {
 // Candidates
 {
    method: 'GET',
    path: '/api/admins/candidates',
    handler: getCandidates,
  },
  {
    method: 'PUT',
    path: '/api/admins/candidates/:id_customer',
    handler: updateCandidate,
  },
  {
    method: 'PUT',
    path: '/api/admins/candidates/:id_customer/reset-password',
    handler: updateCandidatePassword,
  },
  {
    method: 'PUT',
    path: '/api/admins/batches/:id_batch/candidates/:id_customer/status',
    handler: updateCandidateStatus,
  },
  {
    method: 'DELETE',
    path: '/api/candidates/:id_customer',
    handler: deleteCandidate,
  },

  // process  Customers 
  {
    method: 'POST',
    path: '/api/admins/customers',
    handler: adminCreateCustomer,
  },
  {
    method: 'GET',
    path: '/api/admins/customers',
    handler: adminGetCustomers,
  },
  {
    method: 'PUT',
    path: '/api/admins/customers/:id_customer',
    handler: adminUpdateCustomer,
  },
  {
    method: 'DELETE',
    path: '/api/admins/customers/:id_customer',
    handler: adminDeleteCustomer,
  },

  // Batches
  {
    method: 'POST',
    path: '/api/admins/batches',
    handler: createBatch,
  },
  {
    method: 'GET',
    path: '/api/admins/batches',
    handler: getBatches,
  },
  {
    method: 'PUT',
    path: '/api/admins/batches/:id_batch',
    handler: updateBatch,
  },
  {
    method: 'DELETE',
    path: '/api/admins/batches/:id_batch',
    handler: deleteBatch,
  },
    // }
];

module.exports = routes;
