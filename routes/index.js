const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
// const brcypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
const isValidToken = require('../middleware/isValidToken')
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  //once clicked redirect to login
});

router.get('/login', function(req, res, next) {
  res.render('login');
  //if not registered take to register
  //middleware and redirect to auction
});

router.get('/register', function(req, res, next) {
  res.render('register');
  //redirect to login
});

router.get('/auction/:id', isValidToken, async function(req, res, next) {
  const {id} = req.params;
  const user = await Users.findOne({
    where:{
      id: id
    },
  })
  console.log(user);
  // res.cookie("token", token) 
  res.render('auction', {user: user})
});

router.get('/profile/:id', isValidToken, async function(req, res, next) {
  const {id} = req.params;
  const user = await Users.findOne({
    where:{
      id: id
    },
  })
 
  // res.cookie("token", token)
  res.render('profile', {user: user})
})

router.get('/about', function(req, res, next) {
  res.render('about'); 
  // address partial Header route issue
});

module.exports = router;
