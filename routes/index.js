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
  // add id to JWT payload - done
  //decode JWT 
  const token = req.cookies['token']

  const {id} = req.params;

    // if (token){
    //   jwt.verify(
    //     token,
    //     process.env.SECRET_KEY,
    //     function(err, decoded){
    //       if(decoded){
    //         if(id === decoded.id){
    //           console.log("profile id matches")
    //         }
    //       } else {
    //         res.redirect('/error')
    //       }
    //     } 
    //   )
    // } else {
    //   res.redirect('error');
    // }
  // compare saved id const id
  
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


router.get('/admin/17', isValidProfile, async function(req, res, next) {
  // const {id} = req.params;
  // const user = await Users.findOne({
  //   where:{
  //     id: id
  //   }
  // })
  res.render('admin'); 
});

module.exports = router;
