const getUser = async (request, h) => {
    try {
        connection.query(
            'SELECT * FROM `user`',
            function(err, results, fields) {
              console.log(results); // results contains rows returned by server
              console.log(fields); // fields contains extra meta data about results, if available
            }
          );
    
            // Menutup koneksi setelah selesai
            connection.end((err) => {
                if (err) {
                    console.error('Error closing database connection:', err);
                    return;
                }
                console.log('Connection closed');
            });
    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
            error: error.message, // Jangan tampilkan error secara langsung di production
        }).code(500); // Internal Server Error
    }
};



module.exports = {
    getUser
};