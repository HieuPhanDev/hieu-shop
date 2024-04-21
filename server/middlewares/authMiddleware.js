const asyncHandle = require('express-async-handler')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

module.exports.verifyAccessToken = asyncHandle(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      // decode la json dc ma hoa khi gui access token
      if (err)
        return res.status(401).json({
          success: false,
          mes: 'Invalid access token',
        })
      req.user = decode
      next()
    })
  } else {
    return res.status(401).json({
      success: false,
      mes: 'Require authentication!!!',
    })
  }
})

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
