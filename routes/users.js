const express = require('express');
const router = express.Router();
const { Users, Bids, Artwork } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isValidToken = require('../middleware/isValidToken');
require('dotenv').config();
const axios = require('axios');
const { up } = require('../migrations/20220317152333-addTableColumnsArtWorks');
const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR))
const isValidProfile = require('../middleware/isValidProfile')
const adminRoute = require('../middleware/adminRoute')
// ----------------------------------------

// POST register user to Users table
router.post('/register', async (req, res, next) => {
  const { firstName, lastName, email, userName, password} = req.body;
  const hash = bcrypt.hashSync(password, saltRounds)
  const createUser = await Users.create({
    firstName,
    lastName,
    email,
    userName,
    password: hash
  })
  res.redirect('/login');
})

//  POST user login to Users table
router.post('/login', adminRoute, async function(req, res, next) {
  const { userName, password} = req.body;
  const user = await Users.findOne ({
    where: {
      userName : userName
    }
  })
  const comparePass = bcrypt.compareSync(password,user.password)
    if (comparePass) {
      const token = jwt.sign(
        {
          data: user.username,
          id: user.id
        },
        process.env.SECRET_KEY,
        {expiresIn: "1h"}
      );
      res.cookie("token", token)
      res.redirect(`/auction/${user.id}`);
      } else {
        res.send('Sorry, wrong username/password')
      }
  });

// POST artwork to Artworks Table
router.post('/art', async function(req, res, next) {
  const { artID, startingAmount } = req.body
  const config = {
    method: 'get',
    url: `https://api.artic.edu/api/v1/artworks/${artID}`,
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
  const addArtwork = await Artwork.create({
    artTitle: artData.data.title,
    artDetails: artData.data.thumbnail.alt_text,
    artImage: `https://www.artic.edu/iiif/2/${artImageID}/full/843,/0/default.jpg`,
    artArtist: artData.data.artist_title,
    artYear: artData.data.date_display,
    startingAmount: startingAmount,
    maxBid: startingAmount
  })
  res.redirect(`/auction/17`)
});

//DELETE artworks from Artworks Table - admin only
router.post('/art/remove', async function(req, res, next) {
  const { artID } = req.body
  const art = await Artwork.destroy({
    where : {
      id: artID
    }
  })
  res.redirect(`/auction/17`)
});

// POST CREATE and UPDATE Auction activity to Bids Table and Artworks Table
router.post('/auction', isValidToken, async (req, res, next) => {
  const { bidAmount, userID, artID } = req.body;
   const foundBid = await Bids.findOne({where: {userID: userID, artID : artID}});
   if (!foundBid) {
    const createBid =  await Bids.create({bidAmount, userID, artID});
    } else {
      foundBid.bidAmount = bidAmount;
      await foundBid.save();
    } 

  // UPDATE Artworks Table maxBid
  const updateMaxBid = await Artwork.findOne({where: {id: artID}});
    if (!updateMaxBid) {
        throw Error(`Artwork not updated`);
    }
    updateMaxBid.maxBid = bidAmount;
    await updateMaxBid.save();
  res.redirect(`/profile/${userID}`)
})

// DELETE user bid from Bids Table from Profile
router.post('/profile', async function(req, res, next) {
  const {id} = req.params;
  const { bidID, userID} = req.body;
  const deleteBid = await Bids.destroy({
    where : {
      id: bidID
    }
  })
  res.redirect(`/profile/${userID}`)
});

module.exports = router;