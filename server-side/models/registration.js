const mongoose = require('mongoose');
mongoose.connect(
  'mongodb://localhost:27017/pollapp',
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (error) => {
    if (!error) {
      console.log('User Database connected');
    } else {
      console.log('Error connecting to database.');
    }
  }
);
var registrationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  securityquestion: { type: String },
  answer: { type: String },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
});
var user = (module.exports = mongoose.model('userData', registrationSchema));
