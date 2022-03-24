const { Users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR))

const adminRoute = async (req,res, next) =>{
const { userName, password} = req.body;
const user = await Users.findOne ({
  where: {
    userName : userName,
  }
}); //hashing
//admin login
if(user.id != 17){
    next()
};
if(user){
  const comparePass = bcrypt.compareSync(password,user.password)
  if (comparePass){
    if(user.id == 17){ 
        
      console.log("userName is " , userName)
    console.log("user is" , user)
    const token = jwt.sign(
      {
        id: user.id,
        // id: user.id
      },
      process.env.SECRET_KEY,
      {expiresIn: "1h"}
    )
    
    res.cookie("token", token)
    res.redirect(`/admin/${user.id}`)}}}}

    module.exports = adminRoute;