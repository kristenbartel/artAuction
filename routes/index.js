const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
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

router.get('/auction', isValidToken, function(req, res, next) {
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

router.post('/art/:id', async function(req, res, next) {
  
  const id = req.params.id
  var config = {
    method: 'get',
    url: `https://api.artic.edu/api/v1/artworks/${id}`,
    headers: { }
  };

  const artData = await axios(config)
    .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
  });

  const artImageID = artData.data.image_id;

  const addArtwork = await Artworks.create({
    artTitle: artData.data.title,
    artDetails: artData.data.thumbnail.alt_text,
    artImage: `https://www.artic.edu/iiif/2/${artImageID}/full/843,/0/default.jpg`
    // title, artist_display, artwork_type_title, year,  date_start, thumbnail with alt_text
  })

  res.json(artData.data.title)
});



router.get('/profile/:id', isValidToken, async function(req, res, next) {
  const {id} = req.params;

  const user = await Users.findOne({
    where:{
      id: id
    }
    
  })
  res.render('profile', {name: user.username})
})
module.exports = router

module.exports = router;
