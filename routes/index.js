const express = require('express');
const router = express.Router();
const { Users, Bids, Artwork } = require('../models');
// const brcypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
const isValidToken = require('../middleware/isValidToken')
require('dotenv').config();
const {authUser} = require('../middleware/adminAuth')

// GET landing page
router.get('/', async function(req, res, next) {
  const art = await Artwork.findAll({
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
  const art = await Artwork.findAll({
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
  const bidHistory = await Bids.findAll({
    where: {
      userID: user.id,
    }
  })
// console.log('line 62 is the users bidHistory', bidHistory)
  let userArtworks = [];
    bidHistory.forEach(dataItem => {
      userArtworks.push(dataItem.artID)
  })
  // console.log('line 67 is the users-bids-artworks', userArtworks);

  const artwork = await Artwork.findAll({
      where: {
        id: userArtworks //bidHistory.artID
      } 
    })
    // console.log('these are the users artworks:', artwork);
              // console.log(user, bidHistory);
              // const string = JSON.stringify(bidHistory);
              // console.log(string);
              // const parse = JSON.parse(string);
              // console.log(parse);
  res.render('profile', {user: user, bidHistory: bidHistory, artworks: artwork})
})

// GET about view
router.get('/about', function(req, res, next) {
  res.render('about'); 
});


router.get('/admin/17', isValidToken, async function(req, res, next) {
  // const {id} = req.params;
  // const user = await Users.findOne({
  //   where:{
  //     id: id
  //   }
  // })
  res.render('admin'); 
});

// NOTE gallery admin-- a route for them to update Artworks table
module.exports = router;
