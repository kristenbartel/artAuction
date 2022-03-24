require('dotenv').config()
const jwt = require('jsonwebtoken');

const isValidProfile = (req,res, next) =>{
    const token = req.cookies['token']
  
    if (token){
      jwt.verify(
        token,
        process.env.SECRET_KEY,
        function(err, decoded){
            console.log("this is decoded", decoded)
            console.log(decoded.id, req.params.id)
          if(decoded.id == req.params.id){
              // compare decoded.id to req.params.id
            console.log("Valid user profile", decoded)
            next()
          } else {
            res.send('Stop messing with the URL')
          }
        } 
      )
    } else {
      res.redirect('error');
    }
    
  }

  module.exports = isValidProfile;