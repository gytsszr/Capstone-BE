const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'srv1091.hstgr.io',
    user: 'u917904281_root',
    password: '#Htd6P#s0',
    database: 'u917904281_cp_project',
});

// ambil data dari mySQL 
const getUser = () => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM `user`',
            function(err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

module.exports = {
    getUser
};
