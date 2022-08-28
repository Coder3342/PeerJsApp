require('dotenv').config();

const jwt = require('jsonwebtoken');
const queryPromise = require("../models/database");

// Ta fukncija preveri pravilnost JWT uporabnika
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if(token) {
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
        
        if(err){ 
            console.log(err.message);
            res.locals.user = null;
            next();
        }
        
        else{
            var sql = "SELECT * FROM "+process.env.MYSQL_ADDON_DB+".Users WHERE id =" + decodedToken.id;
            var user = await queryPromise(sql);
            user = user[0]
            res.locals.user = user;
            next();
            
        }
        });
    }

    else{
        res.locals.user = null;
        next();
    }
}

module.exports = { checkUser };