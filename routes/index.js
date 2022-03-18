const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks, sequelize } = require('../models');
// const brcypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
const isValidToken = require('../middleware/isValidToken');
const { max } = require('pg/lib/defaults');
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
  // const {artID} = req.body;
  console.log(req.params)
  const user = await Users.findOne({
    where:{
      id: id
    }
  })

  const art = await Bids.findAll({
    attributes : [[sequelize.fn('max', sequelize.col('bidAmount')), 'highBid']],
    include: [{model: Artworks}], 
    group: ['Bids.id', 'Artworks.id'],
    
  });
  console.log(JSON.stringify(art, null, 2));

//   Artworks.findAll({

    
//   });
//  const artItemIDArray = art.map(item => item.dataValues.id)
//  console.log(artItemIDArray);

//  const artItem = artItemIDArray.forEach(extractedArtId)
//   const highBid = await
//     Bids.max('bidAmount',
//     {where: {
//       artID : artItemID
//    }}
//    )
// highBid: highBid
  res.render('auction', {user: user, art: art})
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
