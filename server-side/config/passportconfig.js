const User = require('../models/registration');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const { exists } = require('../models/registration');
module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done({ error: "User doesn't exists!" }, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done({ error: 'Incorrect password!!' }, false);
          }
        });
      });
    })
  );
  passport.serializeUser((user, cb) => {
    cb({}, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      username = user.username;
      cb(err, username);
    });
  });
};
