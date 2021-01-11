const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  githubData: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    select: false
  },
  access_token: {
    type: String,
    required: false,
    select: false
  }
})

userSchema.methods.getToken = function () {
  const signedJwt = jwt.sign(
    {
      id: this._id,
      username: this.username
    },
    'yoursecretkey',
    { expiresIn: '12h' }
  );

  return signedJwt;
}

module.exports = mongoose.model('User', userSchema)
