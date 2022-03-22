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
    startingAmount: startingAmount
  })
  res.send("Artwork added!")
  // res.send(successful post to Artworks table)
});

router.post('/art/remove', async function(req, res, next) {
  const { artName } = req.body
  // const art = await Artwork.findOne({
  //   where: {
  //     artTitle: artName
  //   }
  // })
  //   .catch( e => {
  //     res.send(e)
  //   })
  //   if (!art){
  //     res.send("No art found.")
  //   }
  //   art.destroy();
  //   res.send("Artwork removed!")
  const art = await Artwork.destroy({
    where : {
      artTitle: artName
    }
  })
  // .catch(e => {
  //   res.send("You received the following error:", e)
  // })
  // if (!art){
  //   res.send("No artwork found!")
  // }
  res.send("Artwork deleted!")
});

// POST user bid to Bids table
router.post('/auction', isValidToken, async (req, res, next) => {
  const { bidAmount, userID, artID } = req.body;
  const {id} = req.params;

  console.log('line 117', userID, artID)

  // const user = await Bids.findOne({
  //   where:{ 
  //     userID: userID
  //   },
  // })
  // console.log("this is my user", user);

   const foundBid = await Bids.findOne({where: {userID: userID, artID : artID}});
    console.log(foundBid);

  // function findUserBid() {
  //   Bids.findOne({where: {userID: userID, artID : artID}});
  // }
  
   if (!foundBid) {
    const createBid =  await Bids.create({bidAmount, userID, artID});
    } foundBid.bidAmount = bidAmount
    await foundBid.save();

    // const jane = await User.create({ name: "Jane" });
    // console.log(jane.name); // "Jane"
    // jane.name = "Ada";
    // // the name is still "Jane" in the database
    // await jane.save();
    // // Now the name was updated to "Ada" in the database!


  //   const submitBid =  Bids.create({
  //   bidAmount,
  //   userID,
  //   artID
  // })
 
  const updateMaxBid = await Artwork.findOne({where: {id: artID}});
    if (!updateMaxBid) {
        throw Error(`Artwork not updated`);
    }
    updateMaxBid.maxBid = bidAmount;
    await updateMaxBid.save();
    // console.log('Check this out', updateMaxBid.id, updateMaxBid.maxBid)
    // console.log("this is the info", updateMaxBid)
  res.redirect(`/profile/${foundBid.userID}`,)
  
})

// DELETE a users bid from Bids Table via users profile page
//do we need req.params to know it is the users profile?
    // router.delete('/profile', isValidToken, async (req, res, next) => {
    //   const {aBid} = req.body;
    //   const withdrawBid = await Bids.destroy({
    //     where: {
    //       aBid: aBid
    //     }
    //   })
    // })

// UPDATE a users bid from Bids Table via users profile page 
// do we need req.params to know it is the users profile?
    // router.update('/profile', isValidToken, async (req, res, next) => {
    //   const {aBidID} = req.body; //a specific bidID is needed here
    //   const withdrawBid = await Bids.update(
    //     { bidAmount: "555" }, 
    //     { where: { aBidID: aBidID }
    //   })
    // })

module.exports = router;