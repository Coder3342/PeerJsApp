require('dotenv').config()

const queryPromise = require("../models/database");
const auth = require("../middleware/jwtAuth");
const {checkForm, checkFormLogin} = require("./checkForm")
const getUser = require("./getUser")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const maxDate = 1 * 24 * 60 * 60;

// Kreiranje JWT za uporabnika
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_TOKEN, {
        expiresIn: maxDate
    })
}

// GET zahteva za pridobitev login strani
module.exports.login_get = (req, res) => {
    res.render('login')
}

// POST zahteva na login strani (preverjanje podatkov pri vpisu in ustvarjanje JWT)
module.exports.login_post = async (req, res) => {
    
    const {username, password} = req.body;
    
    try{
        
        const valid = await checkFormLogin(username, password);

        if(valid.id > -1){

            var id = valid.id
            const token = createToken(id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxDate * 1000});
           

        }
        
        res.json(valid.id);
    }
        
    catch(err){
        throw err;  
    }

}

// GET zahteva za pridobitev register strani
module.exports.register_get = (req, res) => {
    res.render('register')
}

// POST zahteva na register strani (preverjanje podatkov pri registraciji)
module.exports.register_post = async(req, res) => {

    var {fname, lname, username, email, 
        dat, password, repass} = req.body;
    
    try{

        var valid = await checkForm(username, password, repass);
        if(valid.error_username != '' || valid.error_password != ''){
            res.json(valid);
            return
        }

        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        const sqlInsert = "INSERT INTO "+process.env.MYSQL_ADDON_DB+".Users ( fname, lname, username, email, date_birth, password)"+
        " VALUES ('"+fname+"', '"+lname+"', '"+username+"', '"+email+"','"+dat+"','"+password+"')";
        
        const result = await queryPromise(sqlInsert);

        const token = createToken(result.insertId);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxDate * 1000});
        res.status(201).json(result.insertId)
        
}
        
    catch(err){
        console.log(err);
        res.status(400).send('ERROR: User cannot be created')
    }
}

// GET zahteva za izpis uporabnika (ko se uporabnik izpiše se njegov JWT uniči)
module.exports.logout_get = (req,res) => {

    res.cookie('jwt', '', { maxAge: 1})
    res.redirect('/login');
}

// GET zahteva za pridobitev profila uporabnika
module.exports.profile_get = (req,res) => {
    res.render('profile')
}

// POST zahteva na profil strani uporabnika (tukaj si lahko uporabnik posodobi svoje podatke)
module.exports.profile_post = async(req,res) => {
    
    
    var user = await getUser(req.cookies.jwt);
    user = user.pop();
    userID = user.id;
    userFname = user.fname;
    userLname = user.lname;
    userName = user.username;
    userEmail = user.email;
    userPasswod = user.password;

    var {fname, lname, username, email, password} = req.body;

    if(userPasswod != '') {
        const salt = await bcrypt.genSalt();
        passwordHash = await bcrypt.hash(password, salt);
    }
    
    var sql = "UPDATE Users "+  
              "SET fname = CASE WHEN LENGTH('"+ fname +"') != 0 THEN  '"+ fname +"'"+ 
              " ELSE '"+ userFname +"' END,"+
              "lname = CASE WHEN LENGTH('"+ lname +"') != 0 THEN  '"+ lname +"'"+ 
              " ELSE '"+ userLname +"' END,"+
              "username = CASE WHEN LENGTH('"+ username +"') != 0 THEN  '"+ username +"'"+ 
              " ELSE '"+ userName +"' END,"+
              "email = CASE WHEN LENGTH('"+ email +"') != 0 THEN  '"+ email +"'"+ 
              " ELSE '"+ userEmail +"' END,"+
              "password = CASE WHEN LENGTH('"+ password +"') != 0 THEN  '"+passwordHash+"'"+ 
              " ELSE '"+ userPasswod +"' END "+
              "WHERE id = "+ userID;
    
    var result = await queryPromise(sql);
    res.redirect(`logout`)
}
