const { check } = require('express-validator')
const { validationResult } = require('express-validator')

exports.registerValid = [
  check('name').not().isEmpty().withMessage('Tên không được để trống'),
  check('email').isEmail().withMessage('Email không hợp lệ'),
  check('password').isLength({ min: 4 }).withMessage('Mật khẩu phải có ít nhất 4 ký tự'),
]

exports.loginValid = [
  check('email').isEmail().withMessage('Email không hợp lệ'),
  check('password').isLength({ min: 4 }).withMessage('Mật khẩu phải có ít nhất 4 ký tự'),
]

exports.forgotPasswordValid = [check('email').not().isEmpty().isEmail().withMessage('Email không hợp lệ')]

exports.resetPasswordValid = [
  check('password').not().isEmpty().isLength({ min: 4 }).withMessage('Mật khẩu phải có ít nhất 4 ký tự'),
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
