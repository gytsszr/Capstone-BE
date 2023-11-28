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
        method: "GET",
        path: "/api/customers/:id_customer/resume",
        handler: getResume,
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
        method: "POST",
        path: "/api/customers/logout",
        handler: customerLogout,
    },
];
module.exports = router;
    
