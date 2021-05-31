//const { Number, Int32 } = require('mongodb');
const mongoose = require('mongoose');
var NumberInt = require('mongoose-int32');
mongoose.connect(
  'mongodb://localhost:27017/pollapp',
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (error) => {
    if (!error) {
      console.log('Database connected');
    } else {
      console.log('Error connecting to database.');
    }
  }
);

var savePollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  pollid: { type: String, unique: true, required: true },
  options: [
    {
      id: { type: String, unique: true },
      options: { type: String },
      count: { type: NumberInt, default: 0 },
    },
  ],
  ID: { type: String, required: true },
  expiration: { type: Date, required: true },
  starred: { type: Boolean, default: false },
  date: {
    type: Date,
    default: Date.now,
  },
});

var savePoll = (module.exports = mongoose.model('savepoll', savePollSchema));
