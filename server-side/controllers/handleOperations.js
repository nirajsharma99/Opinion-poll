const firebase = require('../utils/firebase');

exports.addPoll = (io, data, socket) => {
  console.log('user1' + socket.id);
  var datas = new savePoll({
    question: data.question.question,
    pollid: data.question.id,
    options: data.options,
    ID: data.id,
    expiration: data.expiration,
  });
  datas.save((err, x) => {
    if (err) {
      //result = {'success':false,'message':'Some Error','error':err};
      console.log(err);
    } else {
      const result = { success: true };
      console.log(result);
      savePoll.find({ ID: data.id }).then((x) => {
        io.to(socket.id).emit('receivePolls', x);
      });
      io.emit('pollAdded', result);
    }
  });
};
exports.getPolls = (io, username, socket) => {
  //console.log('user' + username);
  const ref = firebase
    .database()
    .ref('polls')
    .orderByChild('username')
    .equalTo(username);
  ref.on('value', (snapshot) => {
    // console.log(snapshot.val());
    if (snapshot.val()) {
      let data = [];
      data = Object.values(snapshot.val());
      //console.log(data.length);
      io.to(socket.id).emit('receivePolls', data.reverse());
    } else {
      let data = false;
      io.to(socket.id).emit('receivePolls', data);
    }
  });
  console.log();
};

exports.getPoll = (io, id, socket) => {
  //console.log(id);
  const ref = firebase
    .database()
    .ref('polls')
    .orderByChild('pollid')
    .equalTo(id);
  ref.on('value', (snapshot) => {
    if (snapshot.val()) {
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
        username: data[0].username,
      };
      io.to(socket.id).emit('receivePoll', poll);
    } else {
      const send = false;
      io.to(socket.id).emit('receivePoll', false);
    }
  });
};
exports.getPollToEdit = (io, id, socket) => {
  //console.log(id);
  const ref = firebase
    .database()
    .ref('polls')
    .orderByChild('pollid')
    .equalTo(id);
  ref.once('value', (snapshot) => {
    if (snapshot.val()) {
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
      io.to(socket.id).emit('receivePollToEdit', poll);
    }
  });
};
