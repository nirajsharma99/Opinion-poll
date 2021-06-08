const firebase = require('firebase');
var firebaseConfig = {
  apiKey: 'AIzaSyA7hfVczCWRb0weAzdJq_xF59HwExYi8zs',
  authDomain: 'opinion-poll-92018.firebaseapp.com',
  projectId: 'opinion-poll-92018',
  storageBucket: 'opinion-poll-92018.appspot.com',
  messagingSenderId: '595160036554',
  appId: '1:595160036554:web:805398ecee4772b0967033',
  measurementId: 'G-J7WCR3KHPL',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;
