const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");
const GoogleUser = require("../models/googleUser")

// serializeUser will create a cookie with user's unique _id
passport.serializeUser((dbUser, done) => {
  done(null, dbUser._id);
});

// deserializeUser will decrypt the cookie to user's unqiue _id
passport.deserializeUser(async (_id, done) => {
  const user = await GoogleUser.findById(_id)
   done(null, user)
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK
  }, async (accessToken, refreshToken, profile, done) => {
    const dbUser = await GoogleUser.findOne({ googleId: profile.id })
    if(dbUser){
           done(null, dbUser)
    }else{
        let user = await GoogleUser({name: profile.displayName, email: profile.email, googleId: profile.id}).save()
          done(null, user)
    }
  })
);
