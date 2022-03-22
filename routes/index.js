const express = require('express');
const router = express.Router();
const { Users, Bids, Artwork } = require('../models');
const isValidToken = require('../middleware/isValidToken')
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

// GET Auction view as validUser
router.get('/auction/:id', isValidToken, async function(req, res, next) {
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

// GET Profile view as validUser
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
  let userArtworks = [];
    bidHistory.forEach(dataItem => {
      userArtworks.push(dataItem.artID)
  })
  const artwork = await Artwork.findAll({
      where: {
        id: userArtworks
      } 
    })
  res.render('profile', {user: user, bidHistory: bidHistory, artworks: artwork})
})

// GET About Us view
router.get('/about', function(req, res, next) {
  res.render('about'); 
});

router.get('/admin', async function(req, res, next) {
  // const {id} = req.params;
  // const user = await Users.findOne({
  //   where:{
  //     id: id
  //   }
  // })
  res.render('admin'); 
});

module.exports = router;
