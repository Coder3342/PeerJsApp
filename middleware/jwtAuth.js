require('dotenv').config();

const jwt = require('jsonwebtoken');

// Ta fukncija preveri, če za določenega uporabnika že obstaja JWT.
// Če obstaja, lahko brez prijave obišče stran, če pa ne pa ga preusmeri na login
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