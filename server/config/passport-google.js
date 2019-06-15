const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./db');
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new GoogleStrategy({
  clientID: '181588068201-9f7kbuv604fdvv2l27qe06vvo4mfpb2s.apps.googleusercontent.com',
  clientSecret: '7xq28J9qns7Ou83QEoZQmFgc',
  callbackURL: 'http://localhost:3001/api/v1/auth/google/callback',
}, function(accessToken, refreshToken, profile, next) {
    User.findOne({ "google.id": profile.id }, function(err, user) {
        if (user) {
          return res.status(422).send({errors: [{title: 'Invalid email!', detail: 'Email already exist!'}]});
          // return next(err, user);
        } else {
          var newUser = new User();
          newUser.email = profile.emails[0].value;
          newUser.token = profile.id;
          newUser.username = profile.displayName;
          newUser.photo = profile._json.image.url;
          newUser.save(function(err) {
            if (err) throw err;
            next(err, newUser);
        });
    }
  });
}));


