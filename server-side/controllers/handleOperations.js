const firebase = require('../utils/firebase');

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

exports.getPoll = (io, x, socket) => {
  const ref = firebase
    .database()
    .ref('polls')
    .orderByChild('pollid')
    .equalTo(x.id);
  ref.on('value', (snapshot) => {
    if (snapshot.val()) {
      const data = Object.values(snapshot.val());
      const expire = new Date(data[0].expiration) - new Date();
      if (x.username) {
        var voted, index;
        const key = Object.keys(snapshot.val())[0];
        const ref2 = firebase
          .database()
          .ref('polls')
          .child(key)
          .child('voters')
          .orderByChild('username')
          .equalTo(x.username);
        ref2.on('value', (snap) => {
          if (snap.val()) {
            const voter = Object.values(snap.val());
            voted = voter[0].username === x.username;
            index = voted ? voter[0].index : null;
            return { voted, index };
          }
        });
      }

      let poll = {
        question: data[0].question,
        pollid: data[0].pollid,
        options: data[0].options,
        expired: expire < 0 ? true : false,
        expiration: data[0].expiration,
        key: data[0].key,
        username: data[0].username,
        openvote: data[0].openvote,
        voted: voted,
        index: index,
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
        openvote: data[0].openvote,
      };
      io.to(socket.id).emit('receivePollToEdit', poll);
    }
  });
};
