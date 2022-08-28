require('dotenv').config();

const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                req.user = decodedToken.id
                next();
            }
        });
        return;
    }
    res.redirect('/login');
}

module.exports = { requireAuth };