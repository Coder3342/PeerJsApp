require('dotenv').config()

const mysql = require('mysql');
const util = require('util');

// Implementacija modela MySQL podatkovne baze
var pool  = mysql.createPool({
    host     : process.env.MYSQL_ADDON_HOST,
    user     : process.env.MYSQL_ADDON_USER,
    password : process.env.MYSQL_ADDON_PASSWORD,
    database : process.env.MYSQL_ADDON_DB,
    port     : process.env.MYSQL_ADDON_PORT
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    
    if (connection) connection.release()
    return
})
    
pool.query = util.promisify(pool.query)

    
module.exports = pool
module.exports = queryPromise =  (sql) =>{
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, result)=>{
            if(err){ return reject (err);}
            return resolve(result);

        })
    })
}