const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const isValidToken = require('../middleware/isValidToken');
require('dotenv').config();



router.post('/register', async (req, res, next) => {
  const { firstname, lastname, email, username, password} = req.body;
  const createUser = await Users.create({
    firstname,
    lastname,
    email,
    username,
    password
  })
  res.redirect('/login');
})


router.post('/login', async function(req, res, next) {
  const { username, password} = req.body;
  const user = await Users.findOne ({
    where: {
      username : username,
    }
  }) //hashing 
  res.redirect('/auction');
});

module.exports = router;
