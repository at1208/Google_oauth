const {OAuth2Client} = require('google-auth-library');
const axios = require("axios");
const jws = require('jws-jwk');
const moment = require("moment");
const jwt = require('jsonwebtoken');
const jwk = require('../config/jwk');
const GoogleUserOneTap = require('../models/googleUserOneTap');


module.exports.current_user = (req, res) => {
  res.json(req.user)
}

module.exports.logout_user = (req, res) => {
   req.logout()
   res.redirect(process.env.CLIENT_URL)
}

module.exports.login_failed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
}


module.exports.one_tap_google_login = async (req, res) => {
    const { googleToken } = req.body
    const userInfo = async () => {
    const info = await axios(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
    return info.data;
  }
    const user = await userInfo();

    if(user){
      const signatureVerify = await jws.verify(googleToken, jwk);
      if(!signatureVerify){
        return res.status(400).json({
          error: "Authentication failed"
        })
      }

      if (user.aud !== process.env.GOOGLE_CLIENT_ID || user.iss !== 'https://accounts.google.com') {
         return res.status(400).json({
           error: "Authentication failed"
         })
      }

      const existing = await GoogleUserOneTap.findOne({ email: user.email })
      if(!existing){
           const result = await GoogleUserOneTap({ email: user.email, name: user.given_name + user.family_name, picture: user.picture }).save()
           const newUser = { _id: result._id, name: result.name, email: result.email }
           const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
           res.cookie('token', token, { expiresIn: '1d' });
           return res.status(200).json({
            token: token,
            user: newUser
          })
      }
      const existingUser = { _id: existing._id, name: existing.name, email: existing.email }
      const token = jwt.sign({ _id: existing._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
       res.cookie('token', token, { expiresIn: '1d' });
       return res.status(200).json({
         token: token,
         user: existingUser
       })
    }else{
      res.status(400).json({
        error: "Authentication failed"
      })
    }
}
