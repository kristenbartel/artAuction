const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const isValidToken = require('../middleware/isValidToken');
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

router.get('/auction', function(req, res, next) {
  res.render('auction'); 
  // insert isValidUser middleware
  // form for making bid connected to POST
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
  // insert isValidUser middleware
  //specific to user- use destructuring for userID
  // this will render all bids made
});

router.get('/about', function(req, res, next) {
  res.render('about'); 
  // insert isValidUser middleware?? 
  // address partial Header route issue
});


module.exports = router;
