const express = require('express');

const bodyParser = require('body-parser');
const port = 5000;
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
const handleOperations = require('./controllers/handleOperations');
const server = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

io.on('connection', (socket) => {
  console.log('connected to socket!' + socket.id);
  socket.on('connected', (data) => {
    console.log(data);
  });
});

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
          ID: user._id,
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
});
app.get('/', (req, res) => res.send('hello world!'));
app.post('/api', (req, res) => {
  const x = req.body.question.question;
  const y = req.body.options;
  console.log(x, y);
  var data = new savePoll({
    question: req.body.question.question,
    pollid: req.body.question.id,
    options: req.body.options,
    ID: req.body.id,
    expiration: req.body.expiration,
  });
  data
    .save()
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
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
  savePoll
    .findOneAndUpdate(
      { pollid: req.body.pollid },
      { question: req.body.question.question, options: req.body.options }
    )
    .then(() => res.send({ success: true }))
    .catch((error) => res.send(error));
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
  console.log('api working', req.body.id, req.body.count, req.body.pollid);
  const pollid = req.body.pollid;
  savePoll
    .updateOne(
      { pollid: pollid, 'options.id': req.body.id },
      { $set: { 'options.$.count': req.body.count } }
    )
    .then(() => {
      console.log('Count updated');
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post('/deletepoll', (req, res) => {
  //console.log(req.body.key);
  savePoll
    .findOneAndRemove({ _id: req.body.key })
    .then(() => {
      console.log('Poll deleted');
      res.send({ success: true });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post('/getpoll/:id', (req, res) => {
  const x = req.params.id;
  savePoll
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
    .catch((error) => res.send(error));
});
/*---------------------------------------------------user-account-settings----------------------------------*/
app.post('/changePass', (req, res) => {
  console.log(req.body);
  user.findOne({ _id: req.body.userID }).then((data) => {
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
  });
});
app.post('/deleteAccount', (req, res) => {
  console.log(req.body);
  user.findOne({ _id: req.body.userID }).then((data) => {
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
  });
});

app.post('/sendFeedback', (req, res) => {
  console.log(req.body);
  var data = new feedback({
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
    });
});

app.post('/security-question', (req, res) => {
  user
    .findOneAndUpdate(
      { _id: req.body.userid },
      { securityquestion: req.body.question, answer: req.body.answer }
    )
    .then(() => res.send({ success: true }))
    .catch(() => {
      res.send({ success: false });
    });
});

app.post('/forgot-password', (req, res) => {
  user.findOne({ username: req.body.username }).then((data) => {
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
  });
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
server.listen(port, () => console.log(`listening on port ${port}`));
