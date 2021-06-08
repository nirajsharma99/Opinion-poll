const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const passportlocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const user = require('./models/registration');
const savePoll = require('./models/savePoll');
const feedback = require('./models/feedback');

/*-------------------socket-------------------*/
const handleOperations = require('./controllers/handleOperations');
const http = require('http');
const socket = require('socket.io');
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
/*--------------------------------------------*/

/*-------------- firebase ---------------*/
const firebase = require('./utils/firebase');

//const registerRef = firebase.database().ref('users');
/*---------------------------------------*/

app.use(express.json());

io.on('connection', (socket) => {
  console.log('socket connection ' + socket.id);
  socket.on('getPoll', (id) => {
    //console.log(id);
    handleOperations.getPoll(io, id, socket);
  });
  socket.on('getPolls', (username) => {
    handleOperations.getPolls(io, username, socket);
  });
  socket.on('getPollToEdit', (id) => {
    handleOperations.getPollToEdit(io, id, socket);
  });
});

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
};
app.use(cors(corsOptions));
app.use(
  session({
    secret: 'secretcode',
    resave: false,
    saveUninitialized: false,
    /*store: new MongoDBStore({
      uri: 'mongodb://localhost:27017/pollapp',
      collection: 'mySessions',
    }),*/
  })
);
app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passportconfig')(passport); //using the same instance of password in entire server

/*app.use((res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  //res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-type,Accept'
  );
  next();
});*/

//routes

app.post('/login', (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    //console.log(info);
    //console.log(err);
    if (err) console.log(err);
    if (!user) {
      data = { isAuthenticated: false, msg: err.error };
      res.send(data);
    } else {
      req.logIn(user, (err) => {
        console.log(err);
        if (err) console.log(err);
        //res.send('Successfully authenticated');

        const data = {
          isAuthenticated: true,
          username: user.username,
        };
        console.log(data);
        return res.json(data);
      });
    }
  })(req, res, next);
});
app.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send({ success: true });
    }
  });
});
app.get('/getUserData', (req, res) => {
  if (req.session.passport != null) {
    console.log(req.session.passport.user);
    const ID = req.session.passport.user;
    user
      .findOne({ _id: ID })
      .then((user) => {
        data = { username: user.username, id: user._id, success: true };
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.send({ success: false });
  }
});
/*app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: 'http://localhost:3000/create-poll',
    failureRedirect: 'back',
    failureFlash: true,
  })(req, res, next);
});*/

app.post('/register', (req, res) => {
  firebase
    .database()
    .ref('users/')
    .once('value', async (snapshot) => {
      const verify = snapshot.hasChild(req.body.username);
      console.log(verify);
      if (verify) {
        res.send({ success: false, msg: 'User already exists' });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        firebase
          .database()
          .ref('users/' + req.body.username)
          .set({ password: hashedPassword })
          .then(() =>
            res.send({
              success: true,
              msg: 'User registered!, please sign in..',
            })
          );
      }
    });
});

/*app.post('/register', (req, res) => {
  console.log(req.body);
  user.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send({ success: false, msg: 'User already exists' });
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new user({
        username: req.body.username,
        password: hashedPassword,
      });
      newUser.save();
      res.send({ success: true, msg: 'User registered!, please sign in..' });
    }
  });
});*/

app.get('/', (req, res) => res.send('hello world!'));
app.post('/api', (req, res) => {
  const ref = firebase.database().ref('polls').push();
  var today = new Date();
  var data = {
    question: req.body.question.question,
    pollid: req.body.question.id,
    options: req.body.options,
    username: req.body.username,
    expiration: req.body.expiration,
    key: ref.key,
    created: today.toString(),
  };

  ref
    .set({
      question: req.body.question.question,
      pollid: req.body.question.id,
      options: req.body.options,
      username: req.body.username,
      expiration: req.body.expiration,
      key: ref.key,
      created: today.toString(),
      starred: false,
    })
    .then(() => {
      res.send(data);
    })
    .catch((err) => console.log(err));
  /*data
    .save()
    .then((response) => {
      const data = { pollid: response.pollid, key: response._id };
      res.send(data);
    })
    .catch((error) => res.send(error));*/
});

app.post('/getPolls', (req, res) => {
  savePoll
    .find({ ID: req.body.userid })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => res.send(error));
});
app.post('/editpoll', (req, res) => {
  console.log(req.body.key, req.body.expiration);
  const ref = firebase.database().ref('polls').child(req.body.key);
  ref.once('value', (snapshot) => {
    console.log(snapshot.val());
    snapshot.ref
      .update({
        question: req.body.question,
        options: req.body.options,
        expiration: req.body.expiration,
        edited: Date(),
      })
      .then(() => res.send({ success: true }))
      .catch(() => res.send({ success: false }));
  });
});

app.post('/links', (req, res) => {
  const x = req.body.id;
  //console.log(x);
  savePoll
    .findOne({ pollid: x })
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
});
app.post('/submitresponse', (req, res) => {
  console.log('api working', req.body.index);
  const pollid = req.body.pollid;
  const toUpdate = {
    count: req.body.count,
    error: false,
    id: req.body.id,
    options: req.body.options,
  };
  console.log(req.body.id);
  const ref = firebase
    .database()
    .ref(`polls/${req.body.key}/options/`)
    .orderByChild('id')
    .equalTo(req.body.id);

  //ref.update(toUpdate);
  ref.once('value', (snapshot) => {
    snapshot.child(req.body.index).ref.update({ count: req.body.count });
    console.log(snapshot.val());
  });

  /*savePoll
    .updateOne(
      { pollid: pollid, 'options.id': req.body.id },
      { $set: { 'options.$.count': req.body.count } }
    )
    .then(() => {
      console.log('Count updated');
    })
    .catch((err) => {
      console.log(err);
    });*/
});
app.post('/deletepoll', (req, res) => {
  //console.log(req.body.key);
  console.log(req.body.key + ' ' + req.body.pollid);
  const ref = firebase.database().ref('polls').child(req.body.key);
  ref.once('value', (snapshot) => {
    console.log(snapshot.val());
    snapshot.ref
      .remove()
      .then(() => res.send({ success: true }))
      .catch(() => console.log({ success: false }));
  });
  /*savePoll
    .findOneAndRemove({ _id: req.body.key })
    .then(() => {
      console.log('Poll deleted');
      res.send({ success: true });
    })
    .catch((err) => {
      console.log(err);
    });*/
});
app.get('/getpoll/:id', (req, res) => {
  const x = req.params.id;
  console.log(x);
  const ref = firebase
    .database()
    .ref('polls')
    .orderByChild('pollid')
    .equalTo(x);
  ref.on('value', (snapshot) => {
    const data = Object.values(snapshot.val());
    //console.log(data[0]);
    const expire = new Date(data[0].expiration) - new Date();
    let poll = {
      question: data[0].question,
      pollid: data[0].pollid,
      options: data[0].options,
      expired: expire < 0 ? true : false,
      expiration: data[0].expiration,
      key: data[0].key,
    };
    res.send(poll);
  });
  /*savePoll
    .findOne({ pollid: x })
    .then((response) => {
      const expire = new Date(response.expiration) - new Date();
      const data = {
        question: response.question,
        options: response.options,
        color: '',
        expired: expire < 0 ? true : false,
        expiration: response.expiration,
      };
      console.log(data);
      res.send(data);
    })
    .catch((error) => res.send(error));*/
});
/*---------------------------------------------------user-account-settings----------------------------------*/
app.post('/importance', (req, res) => {
  console.log(req.body);
  const ref = firebase.database().ref('polls').child(req.body.key);
  ref.once('value', (snapshot) => {
    console.log(snapshot.val());
    snapshot.ref
      .update({ starred: req.body.starred })
      .then(() => res.send({ success: true }))
      .catch((err) => res.send(err));
  });
});

app.post('/changePass', (req, res) => {
  //console.log(req.body);
  const ref = firebase.database().ref('users').child(req.body.username);
  ref.once('value', (snapshot) => {
    if (snapshot.val()) {
      const currentPass = snapshot.val().password;
      bcrypt.compare(req.body.oldpass, currentPass, async (err, result) => {
        if (err) throw err;
        if (result) {
          const hashedPassword = await bcrypt.hash(req.body.newpass, 10);
          snapshot.ref
            .update({ password: hashedPassword })
            .then(() => res.send({ success: true }));
        } else {
          res.send({ success: false });
        }
      });
    }
  });
  /*user.findOne({ _id: req.body.userID }).then((data) => {
    //console.log(user);
    bcrypt.compare(req.body.oldpass, data.password, async (err, result) => {
      if (err) throw err;
      if (result === true) {
        const newpass = await bcrypt.hash(req.body.newpass, 10);
        user
          .findOneAndUpdate({ _id: data.id }, { password: newpass })
          .then(() => {
            res.send({ success: true });
          });
      } else {
        res.send({ success: false });
      }
    });
  });*/
});
app.post('/deleteAccount', (req, res) => {
  console.log(req.body);
  const ref = firebase.database().ref('users').child(req.body.username);
  ref.once('value', (snapshot) => {
    console.log(snapshot.val());
    if (snapshot.val()) {
      const currentPassword = snapshot.val().password;
      bcrypt.compare(req.body.password, currentPassword, (err, result) => {
        if (err) throw err;
        if (result) {
          snapshot.ref
            .remove()
            .then(() => res.send({ success: true }))
            .catch(() => res.send({ success: false }));
        }
      });
    }
  });
  /*user.findOne({ _id: req.body.userID }).then((data) => {
    bcrypt.compare(req.body.password, data.password, (err, result) => {
      if (err) throw err;
      if (result === true) {
        user.findOneAndRemove({ _id: data._id }).then(() => {
          res.send({ success: true });
        });
      } else {
        res.send({ success: false });
      }
    });
  });*/
});

app.post('/sendFeedback', (req, res) => {
  console.log(req.body);
  firebase
    .database()
    .ref('feedback')
    .push({
      username: req.body.username,
      subject: req.body.subject,
      message: req.body.message,
      date: Date(),
    })
    .then(() => res.send({ success: true }))
    .catch((err) => res.send(err));
});
app.post('/reportPoll', (req, res) => {
  firebase
    .database()
    .ref('reports')
    .push({
      reason: req.body.report,
      pollid: req.body.pollid,
      owner: req.body.owner,
      date: Date(),
    })
    .then(() => res.send({ success: true }))
    .catch(() => res.send({ success: false }));
});
/*var data = new feedback({
    username: req.body.username,
    subject: req.body.subject,
    message: req.body.message,
  });
  data
    .save()
    .then(() => {
      res.send({ success: true });
    })
    .catch((err) => {
      console.log(err);
    });*/

app.post('/security-question', (req, res) => {
  console.log(req.body);
  const ref = firebase.database().ref('users').child(req.body.username);
  ref.once('value', (snapshot) => {
    console.log(snapshot.val());
    if (snapshot.val()) {
      bcrypt.compare(
        req.body.password,
        snapshot.val().password,
        (err, result) => {
          if (err) throw err;
          if (result) {
            snapshot.ref
              .update({
                securityQuestion: req.body.question,
                answer: req.body.answer,
              })
              .then(() => res.send({ success: true }))
              .catch((err) => res.send(err));
          } else {
            res.send({ success: false });
          }
        }
      );
    }
  });
  /*user
    .findOneAndUpdate(
      { _id: req.body.userid },
      { securityquestion: req.body.question, answer: req.body.answer }
    )
    .then(() => res.send({ success: true }))
    .catch(() => {
      res.send({ success: false });
    });*/
});

app.post('/forgot-password', (req, res) => {
  const ref = firebase.database().ref('users').child(req.body.username);
  ref.once('value', (snapshot) => {
    if (snapshot.val()) {
      const data = snapshot.val();
      if (
        data.securityQuestion === req.body.question &&
        data.answer === req.body.answer
      ) {
        res.send({ success: true });
      } else {
        res.send({ success: false, msg: 'Incorrect question or answer!' });
      }
    } else {
      res.send({ success: false, msg: 'No such user exists!' });
    }
  });
  /*user.findOne({ username: req.body.username }).then((data) => {
    if (data) {
      if (
        data.securityquestion === req.body.question &&
        data.answer === req.body.answer
      ) {
        res.send({ success: true });
      } else {
        res.send({ success: false, msg: 'Incorrect question or answer!' });
      }
    }
    if (!data) {
      res.send({ success: false, msg: 'No such user exists!' });
    }
  });*/
});
app.post('/resetPassword', (req, res) => {
  //console.log(newPass);
  user.findOne({ username: req.body.username }, async (err, data) => {
    const newPass = await bcrypt.hash(req.body.password, 10);
    if (err) throw err;
    if (data) {
      user
        .findOneAndUpdate({ username: data.username }, { password: newPass })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => {
          console.log(err);
        });
    }
  });
});
server.listen(PORT, () => console.log(`listening on port ${PORT}`));
