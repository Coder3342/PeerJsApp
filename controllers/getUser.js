require('dotenv').config();

const jwt = require('jsonwebtoken');
const queryPromise = require("../models/database");

module.exports = getUser = (token) => {
    var user;

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
        
        if(err) 
            {console.log(err.message); 
             return;}
        
             else {
            
            var sql = "SELECT * FROM " + process.env.MYSQL_ADDON_DB + ".Users WHERE id = " + decodedToken.id;
            user = queryPromise(sql);
            
            }
    })
    return user
}



