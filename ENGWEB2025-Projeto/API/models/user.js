const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  creationDate: Date
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)