//routes boleh diisi disini yaa
const {getUser, createUser, loginUser, getCurrentUser, logoutUser, updateUser} = require('./user/handler');
const {getResume, resume, deleteResume, parsePDF} = require('./resume/handler');

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
        method: 'GET',
        path: "/api/users/resume/parse",
        handler: parsePDF
    },

// Applyment
    
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
    }
];

module.exports = routes;