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
  }); 
  if (user) {
    if (user.id != 17) {
        return next()
    };
    const comparePass = bcrypt.compareSync(password, user.password)
    if (comparePass) {
      try {  
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.SECRET_KEY,
        {expiresIn: "1h"}
      )
      res.cookie("token", token)
      return res.redirect(`/admin/${user.id}`)
      }
      catch (e) {
        console.log(e)
      }
    } else {
      res.send("sorry, wrong password");
    }
  } else {
    res.send("sorry, no user found");
  }
}


module.exports = adminRoute;