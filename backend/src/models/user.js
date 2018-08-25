const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: {type: String},
  passwordHash: { type: String },
  role: { type: String }
})

userSchema.statics.format = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role
  }
}

const User = mongoose.model('user', userSchema)

module.exports = User
