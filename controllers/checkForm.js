require('dotenv').config();

const queryPromise = require("../models/database");
const bcrypt = require('bcrypt');

checkForm = async (username, password, repassword) => {
    const sql = "SELECT * FROM "+process.env.MYSQL_ADDON_DB+".Users WHERE username = '"+username+"'";
    var errors = {error_username : "", error_password : ""};
    var data = await queryPromise(sql);

    if(data.length > 0){
        errors.error_username = "Username exists"
    } 

    if(password !== repassword){
        errors.error_password = "Passwords don't match"
    } 
    return errors



}

checkFormLogin = async (username, password) => {
   const sql = "SELECT * FROM "+process.env.MYSQL_ADDON_DB+".Users WHERE "+process.env.MYSQL_ADDON_DB+".Users.username = '"+ username +"'"
    var response = {id : -1}
    
    var data = await queryPromise(sql);
    if(data.length){
        //console.log("Wrong username/password")   
        const userPasswod = data[0].password;
        const id = data[0].id;
        const auth = await bcrypt.compare(password, userPasswod);
        
        if(auth == true) response.id = id;
    }

    return response
}

module.exports = { checkForm, checkFormLogin}
    

