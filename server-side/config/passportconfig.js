const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const firebase = require('../utils/firebase');
module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      firebase
        .database()
        .ref('users/')
        .once('value', (snapshot) => {
          const verify = snapshot.hasChild(username);
          if (verify) {
            const pass = snapshot.child(`${username}/password`).val();
            const user = { username: username };
            bcrypt.compare(password, pass, (err, result) => {
              if (err) throw err;
              if (result === true) {
                return done(null, user);
              } else {
                return done({ error: 'Incorrect password!!' }, false);
              }
            });
          } else {
            return done({ error: "User doesn't exists!" }, false);
          }
        });
    })
  );
  passport.serializeUser((user, cb) => {
    cb({}, user.username);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      username = user.username;
      cb(err, username);
    });
  });
};
