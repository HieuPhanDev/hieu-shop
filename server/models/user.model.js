const mongoose = require('mongoose')
const crypto = require('crypto')

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    registerToken: String,
    registerTokenExpire: Date,
  },
  { timestamps: true }
)
userSchema.methods.getCreateToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
  return resetToken
}
module.exports = mongoose.model('User', userSchema)
