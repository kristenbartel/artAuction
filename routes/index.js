const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
// const brcypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
const isValidToken = require('../middleware/isValidToken')
require('dotenv').config();

// GET landing page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  //once clicked redirect to login
});

// GET register view
router.get('/register', function(req, res, next) {
  res.render('register');
});

// GET login view
router.get('/login', function(req, res, next) {
  res.render('login');
});

// GET auction view as validUser
router.get('/auction/:id', isValidToken, async function(req, res, next) {
  const {id} = req.params;
  const user = await Users.findOne({
    where:{
      id: id
    },
  })
  res.render('auction', {user: user})
});

// GET profile view as validUser
router.get('/profile/:id', isValidToken, async function(req, res, next) {
  const {id} = req.params;
  const user = await Users.findOne({
    where:{
      id: id
    },
  })
  res.render('profile', {user: user})
})

// GET about view
router.get('/about', function(req, res, next) {
  res.render('about'); 
});

// NOTE gallery admin-- a route for them to update Artworks table
module.exports = router;
