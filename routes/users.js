const express = require('express');
const router = express.Router();
const { Users, Bids, Artworks } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isValidToken = require('../middleware/isValidToken');
require('dotenv').config();
const axios = require('axios');
const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_FACTOR))

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
router.post('/login', async function(req, res, next) {
  const { userName, password} = req.body;
  const user = await Users.findOne ({
    where: {
      userName : userName,
    }
  }); //hashing

  if(user){
    const comparePass = bcrypt.compareSync(password,user.password)
    if (comparePass){
      const token = jwt.sign(
        {
          data:user.username
        },
        process.env.SECRET_KEY,
        {expiresIn: "1h"}
      );
      res.cookie("token", token)
      res.redirect(`/auction/${user.id}`);
    } else {
      res.send('Sorry, wrong username/password')
    }
  } else {
    res.send("sorry, no user found");
  }
});

// POST artworks to Artworks table
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
    artDetails: `<ul><li><b>Artist:</b>${artData.data.artist_title}</li><li><b>Year:</b>${artData.data.date_display}</li><li><b>Description:</b>${artData.data.thumbnail.alt_text}</li></ul>`,
    artImage: `https://www.artic.edu/iiif/2/${artImageID}/full/843,/0/default.jpg`
  })
  res.json(artData.data.title)
  // res.send(successful post to Artworks table)
});

// POST user bid to Bids table
router.post('/auction', isValidToken, async (req, res, next) => {
  const { bidAmount, userID } = req.body;
  console.log(bidAmount,userID)
  const submitBid = await Bids.create({
    bidAmount,
    userID
  })
  console.log(submitBid)
  res.send('Thanks for your bid');
  // res.redirect('profile')
})

module.exports = router;