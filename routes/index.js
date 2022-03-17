const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
// const brcypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
const isValidToken = require('../middleware/isValidToken')
require('dotenv').config();

// GET landing page
router.get('/', async function(req, res, next) {
  const art = await Artworks.findAll({
  })
  res.render('index', {art:art});
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
    }
  })
  const art = await Artworks.findAll({
  })
      // const highBid = await Bids.max('bidAmount')
      // const highBid = await Bids.findAll({
      //   where: {
      //     artID: artID
      //   }
      // })
      // max('bidAmount')
  res.render('auction', {user: user, art: art })
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

router.get('/admin', function(req, res, next) {
  res.render('admin'); 
});

// NOTE gallery admin-- a route for them to update Artworks table
module.exports = router;
