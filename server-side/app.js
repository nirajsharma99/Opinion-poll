const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const passport = require('passport');
const passportlocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const app = express();
const path = require('path');

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
const { now } = require('mongoose');
/*---------------------------------------*/

app.use(express.json());

io.on('connection', (socket) => {
  console.log('socket connection ' + socket.id);
  socket.on('getPoll', (x) => {
    handleOperations.getPoll(io, x, socket);
  });
  socket.on('getPolls', (username) => {
    handleOperations.getPolls(io, username, socket);
  });
  socket.on('getPollToEdit', (id) => {
    handleOperations.getPollToEdit(io, id, socket);
  });
});

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
};
app.use(cors(corsOptions));
app.use(
  session({
    secret: 'secretcode',
    resave: false,
    saveUninitialized: false,
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
  passport.authenticate('local', (err, user, info) => {
    if (err) console.log(err);
    if (!user) {
      data = { isAuthenticated: false, msg: err.error };
      res.send(data);
    } else {
      req.logIn(user, (err) => {
        console.log(err);
        if (err) console.log(err);
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

app.post('/register', (req, res) => {
  firebase
    .database()
    .ref('users/')
    .once('value', async (snapshot) => {
      const verify = snapshot.hasChild(req.body.username);
      if (verify) {
        res.send({ success: false, msg: 'User already exists' });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        firebase
          .database()
          .ref('users/' + req.body.username)
          .set({ password: hashedPassword, date: Date() })
          .then(() =>
            res.send({
              success: true,
              msg: 'User registered!, please sign in..',
            })
          );
      }
    });
});

app.post('/api', (req, res) => {
  const ref = firebase.database().ref('polls').push();
  var today = Date();
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
});

app.post('/editpoll', (req, res) => {
  const ref = firebase.database().ref('polls').child(req.body.key);
  ref.once('value', (snapshot) => {
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

app.post('/submitresponse', (req, res) => {
  const ref = firebase
    .database()
    .ref(`polls/${req.body.key}/options/`)
    .orderByChild('id')
    .equalTo(req.body.id);

  ref.once('value', (snapshot) => {
    snapshot.child(req.body.index).ref.update({ count: req.body.count });
    firebase
      .database()
      .ref(`polls/${req.body.key}/voters`)
      .push({ username: req.body.username, index: req.body.index })
      .then(() => res.send({ success: true }))
      .catch(() => res.send({ success: false }));
  });
});
app.post('/deletepoll', (req, res) => {
  const ref = firebase.database().ref('polls').child(req.body.key);
  ref.once('value', (snapshot) => {
    snapshot.ref
      .remove()
      .then(() => res.send({ success: true }))
      .catch(() => console.log({ success: false }));
  });
});

/*---------------------------------------------------user-account-settings----------------------------------*/
app.post('/importance', (req, res) => {
  const ref = firebase.database().ref('polls').child(req.body.key);
  ref.once('value', (snapshot) => {
    snapshot.ref
      .update({ starred: req.body.starred })
      .then(() => res.send({ success: true }))
      .catch((err) => res.send(err));
  });
});

app.post('/changePass', (req, res) => {
  const ref = firebase.database().ref('users').child(req.body.username);
  ref.once('value', (snapshot) => {
    if (snapshot.val()) {
      const currentPass = snapshot.val().password;
      bcrypt.compare(req.body.oldpass, currentPass, async (err, result) => {
        if (err) throw err;
        if (result) {
          const hashedPassword = await bcrypt.hash(req.body.newpass, 10);
          snapshot.ref
            .update({
              password: hashedPassword,
              updatedpassword: Date(),
            })
            .then(() => res.send({ success: true }));
        } else {
          res.send({ success: false });
        }
      });
    }
  });
});
app.post('/deleteAccount', (req, res) => {
  const ref = firebase.database().ref('users').child(req.body.username);
  ref.once('value', (snapshot) => {
    if (snapshot.val()) {
      const currentPassword = snapshot.val().password;
      bcrypt.compare(req.body.password, currentPassword, (err, result) => {
        if (err) throw err;
        if (result) {
          snapshot.ref
            .remove()
            .then(() => res.send({ success: true }))
            .catch(() => res.send({ success: false }));
        }else{
          res.send({success:false});
        }
        
      });
    }
  });
});

app.post('/sendFeedback', (req, res) => {
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

app.post('/security-question', (req, res) => {
  const ref = firebase.database().ref('users').child(req.body.username);
  ref.once('value', (snapshot) => {
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
});
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});
server.listen(PORT, () => console.log(`listening on port ${PORT}`));
