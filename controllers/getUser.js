require('dotenv').config();

const jwt = require('jsonwebtoken');
const queryPromise = require("../models/database");

// Ta funkcija vrne uporabnika na podlagi pridobljenega JWT
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



