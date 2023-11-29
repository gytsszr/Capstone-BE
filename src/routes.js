//routes boleh diisi disini yaa

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
  updateApplyment,
  deleteApplyment,
  customerLogout,
} = require("./customer/handler");

const {
    getCandidates,updateCandidate,updateCandidatePassword,
    updateCandidateStatus,deleteCandidate,
    adminCreateCustomer,adminGetCustomers,adminUpdateCustomer,adminDeleteCustomer,
    createBatch,getBatches,updateBatch,deleteBatch,
  } = require('./admin/handler');
  
const routes = [
    //costumer
    {
        method: "GET",
        path: "/api/customers",
        handler: getCustomer,
    },
    {
        method: "POST",
        path: "/api/customers/register",
        handler: registerCustomer,
    },
    {
        method: "POST",
        path: "/api/customers/login",
        handler: loginCustomer,
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
        method: "POST",
        path: "/api/customers/:id_customer/batches/:batchId/apply",
        handler: applyBatch,
    },
    {
        method: "GET",
        path: "/api/customers/:id_customer/resume",
        handler: getResume,
    },
    {
        method: "GET",
        path: "/api/customers/batches",
        handler: getBatches,
    },
    {
        method: "GET",
        path: "/api/customers/batches/:batchId",
        handler: getBatch,
    },
    {
        method: "PUT",
        path: "/api/customers/:id_customer/applyments/:applyment_id",
        handler: updateApplyment,
    },
    {
        method: "DELETE",
        path: "/api/customers/:id_customer/applyments/:applyment_id",
        handler: deleteApplyment,
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
  //{
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
    // 
];
module.exports = router;
    
