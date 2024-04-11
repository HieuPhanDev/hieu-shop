const asyncHandle = require('express-async-handler')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
module.exports.authenticate = asyncHandle(async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token failed.')
    }
  } else {
    res.status(401)
    throw new Error('Not authorized, no token.')
  }
})

module.exports.authorizeAdmin = asyncHandle((req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).json({ message: 'Not authorized as an admin.' })
  }
})
