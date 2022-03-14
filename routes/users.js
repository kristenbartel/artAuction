const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const isValidToken = require('../middleware/isValidToken');
require('dotenv').config();



router.post('/register', async (req, res, next) => {
  const { firstName, lastName, email, userName, password} = req.body;
  const createUser = await Users.create({
    firstName,
    lastName,
    email,
    userName,
    password
  })
  res.json(createUser);
})


router.post('/login', async function(req, res, next) 
  {
  const { username, password} = req.body;
  const user = await Users.findOne ({
    where: {
      username : username,
    }
  }) //hashing 
  res.redirect('/auction');
});

module.exports = router;
