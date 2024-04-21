const { check } = require('express-validator')
const { validationResult } = require('express-validator')

exports.registerValid = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password').isLength({ min: 4 }).withMessage('Password must be at least  4 characters long'),
]

exports.loginValid = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password').isLength({ min: 4 }).withMessage('Password must be at least  4 characters long'),
]

exports.forgotPasswordValid = [check('email').not().isEmpty().isEmail().withMessage('Must be a valid email address')]

exports.resetPasswordValid = [
  check('newPassword').not().isEmpty().isLength({ min: 4 }).withMessage('Password must be at least  4 characters long'),
]

exports.Validation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }
  next()
}
