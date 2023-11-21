const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const mysql = require('mysql2');

const init = async () =>{
    const connection = mysql.createConnection({
        host: 'srv1091.hstgr.io',
        user: 'u917904281_root',
        password: '#Htd6P#s0',
        database: 'u917904281_cp_project',
    });
    const server = Hapi.server({
        port: 3306,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    })
    server.route(routes)
    await server.start();
    console.log(server.info.uri);
};

init();