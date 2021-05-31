//const { Number, Int32 } = require('mongodb');
const mongoose = require('mongoose');
var NumberInt = require('mongoose-int32');
mongoose.connect(
  'mongodb://localhost:27017/pollapp',
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (error) => {
    if (!error) {
      console.log('feedback Database connected');
    } else {
      console.log('Error connecting to database.');
    }
  }
);

var feedbackSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  message: { type: String, required: true },
  username: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

var feedback = (module.exports = mongoose.model('feedback', feedbackSchema));
