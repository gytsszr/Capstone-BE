//routes boleh diisi disini yaa
const {getUser, createUser, loginUser, getCurrentUser, logoutUser, updateUser} = require('./user/handler');
const {getResume, resume, deleteResume, parsePDF, parseAllPdf} = require('./resume/handler');
const {createApplyment, viewAllApplyment, viewApplymentByUID, viewApplymentByBID} = require('./applyment/handler');
const {
    getAdmin,
    registerAdmin,
    loginAdmin,
    AdmingetCustomers,
    registerBatch,
    logoutAdmin,
    getApplyments,
    getApplyment,
    AdmingetCandidates,
    AdminupdateCandidate,
    AdminupdateCandidatePassword,
    AdminupdateCandidateStatus,
    AdmindeleteCandidate,
    AdmincreateCustomer,
    AdminupdateCustomer,
    AdmindeleteCustomer,
        } = require('./admin/handler');

const {
    getCustomer,
    registerCustomer,
    loginCustomer,
    getCustomerById,
    updateCustomer,
    // getResume,
    applyBatch,
    getBatches,
    getBatch,
    updateApplyment,
    deleteApplyment,
    customerLogout,
        } = require("./costumer/handler");

      

const routes = [
    //user
    {
        method: 'GET',
        path: '/',
        handler: getUser
    },
    {
        // CreateNew User
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
        //Edit User
        method: 'PUT',
        path: "/api/users/current",
        handler: updateUser
    },
    {
        // Logout User
        method: 'DELETE',
        path: "/api/users/logout",
        handler: logoutUser
    },

// Resume

    {
        //Adding Resume
        method: 'POST',
        path: "/api/users/resume",
        handler: resume
    },
    {
        //Reupload Resume
        method: 'PUT',
        path: "/api/users/resume",
        handler: resume
    },
    {
        //Get Resume
        method: 'GET',
        path: "/api/users/resume",
        handler: getResume
    },
    {
        //Delete Resume
        method: 'DELETE',
        path: "/api/users/resume",
        handler: deleteResume
    },
    {
        //Parse PDF
        method: 'POST',
        path: "/api/users/resume/parse",
        handler: parsePDF
    },
    {
        //Parse All Resume 
        method: 'GET',
        path: "/api/users/resume/parse",
        handler: parseAllPdf
    },

// Applyment
    
    {
        //create applyment
        method: 'POST',
        path: "/api/applyment",
        handler: createApplyment
    },
    {
        //view all applyment
        method: 'GET',
        path: "/api/applyment",
        handler: viewAllApplyment
    },
    {
        //viewing applyment by user id
        method: 'GET',
        path: "/api/applyment/user",
        handler: viewApplymentByUID
    },
    {
        //viewing all applyment by batch id @batch
        method: 'POST',
        path: "/api/applyment/batch",
        handler: viewApplymentByBID
    },
//admin,
    {
        // getting Admin
        method: 'GET',
        path: '/api/admins',
        handler: getAdmin,
    },
    {
        method: 'POST',
        path: '/api/admins/register',
        handler: registerAdmin,
    },
    {
        method: 'POST',
        path: '/api/admins/login',
        handler: loginAdmin,
    },
    {
        method: 'GET',
        path: '/api/admins/customers',
        handler: AdmingetCustomers,
    },
    {
        method: 'POST',
        path: '/api/admins/batch',
        handler: registerBatch,
    },
    {
        method: 'GET',
        path: '/api/admins/applyments',
        handler: getApplyments,
    },
    {
        method: 'GET',
        path: '/api/admins/applyments/{applyId}',
        handler: getApplyment,
    },
    {
        method: 'GET',
        path: '/api/admins/candidates',
        handler: AdmingetCandidates,
    },
    {
        method: 'PUT',
        path: '/api/admins/candidates/{candidateId}',
        handler: AdminupdateCandidate,
    },
    {
        method: 'PUT',
        path: '/api/admins/candidates/password/{candidateId}',
        handler: AdminupdateCandidatePassword,
    },
    {
        method: 'PUT',
        path: '/api/admins/candidates/status/{candidateId}',
        handler: AdminupdateCandidateStatus,
    },
    {
        method: 'DELETE',
        path: '/api/admins/candidates/{candidateId}',
        handler: AdmindeleteCandidate,
    },
    {
        method: 'POST',
        path: '/api/admins/customers',
        handler: AdmincreateCustomer,
    },
    {
        method: 'PUT',
        path: '/api/admins/customers/{customerId}',
        handler: AdminupdateCustomer,
    },
    {
        method: 'DELETE',
        path: '/api/admins/customers/{customerId}',
        handler: AdmindeleteCustomer,
    },
    {
        method: 'POST',
        path: '/api/admins/logout',
        handler: logoutAdmin,
    },
//Costumer
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
    // {
    //     method: "GET",
    //     path: "/api/customers/:id_customer/resume",
    //     handler: getResume,
    // },
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
    }
];

module.exports = routes;