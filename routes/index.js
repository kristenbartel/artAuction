const express = require('express');
const router = express.Router();
const { Users, Bids, Artwork } = require('../models');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const axios = require('axios');
const isValidToken = require('../middleware/isValidToken')
const isValidProfile = require('../middleware/isValidProfile')
require('dotenv').config();

// GET Landing Page view
router.get('/', async function(req, res, next) {
  const art = await Artwork.findAll({
  })
  res.render('index', {art:art});
  //once clicked redirect to login
});

// GET Register view
router.get('/register', function(req, res, next) {
  res.render('register');
});

// GET Login view
router.get('/login', function(req, res, next) {
  res.render('login');
});

// GET auction view as validUser
router.get('/auction/:id', isValidProfile, async function(req, res, next) {
  const {id} = req.params;
  const user = await Users.findOne({
    where:{
      id: id
    }
  })
  const art = await Artwork.findAll({
  })
  res.render('auction', {user: user, art: art })
});

// GET profile view as validUser
router.get('/profile/:id', isValidProfile, async function(req, res, next) {
  const {id} = req.params;
  const user = await Users.findOne({
    where:{
      id: id
    },
  })
  const bidHistory = await Bids.findAll({
    where: {
      userID: user.id,
    }
  })
  let userArtworks = [];
    bidHistory.forEach(dataItem => {
      userArtworks.push(dataItem.artID)
  })
  console.log(userArtworks)
  const artwork = await Artwork.findAll({
      where: {
        id: userArtworks
      } 
    })
  res.render('profile', {user: user, bidHistory: bidHistory, artworks: artwork})
})

// GET Profile Artwork Details view
router.get('/details/:artID/:user', async function(req, res, next) {
  const artID = req.params.artID;
  const user = req.params.user;
  console.log(artID, user);
  const users = await Users.findOne({
    where: {
      id: user
    }
  })
  const artDetail = await Artwork.findOne({
    where: {
      id: artID
    }
  })
  res.render('profileDetails', {artDetail: artDetail, users: users}); 
});

// GET About Us view
router.get('/about', function(req, res, next) {
  res.render('about'); 
});

router.get('/admin/:id', isValidProfile, async function(req, res, next) {
  const {id} = req.params;
  const user = await Users.findOne({
    where:{
      id: 17
    }
  })
  res.render('admin', {user: user}); 

});

module.exports = router;
