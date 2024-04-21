const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authenticate = asyncHandler(async (req, res, next) => {
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

const authorizeAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user
  if (role !== 'Admin')
    return res.status(401).json({
      success: false,
      mes: 'Require admin role',
    })
  next()
})

module.exports = {
  authenticate,
  authorizeAdmin,
}
