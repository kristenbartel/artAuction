const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const isValidToken = require('../middleware/isValidToken');
require('dotenv').config();
const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR))



router.post('/register', async (req, res, next) => {
  const { firstName, lastName, email, userName, password} = req.body;
  const hash = bcrypt.hashSync(password, saltRounds)


  const createUser = await Users.create({
    firstName,
    lastName,
    email,
    userName,
    password: hash
  })
  res.redirect('/login');
})


router.post('/login', async function(req, res, next) {
  const { userName, password} = req.body;
  const user = await Users.findOne ({
    where: {
      userName : userName,
    }
  }); //hashing
  if(user){
    const comparePass = bcrypt.compareSync(password,user.password)
    if (comparePass){
      const token = jwt.sign(
        {
          data:user.username
        },
        process.env.SECRET_KEY,
        {expiresIn: "1h"}
      );
      res.cookie("token", token)
      res.redirect(`/profile/${user.id}`);
    } else {
      res.send('Sorry, wrong username/password')
    }
  } else {
    res.send("sorry, no user found");
  }
  
});

module.exports = router;
