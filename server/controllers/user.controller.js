const asyncHandler = require('express-async-handler')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/createToken')
const sendEmail = require('../utils/senEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { generateRefreshToken, generateAccessToken } = require('../utils/jwt')

module.exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    throw new Error('Please fill all fields!')
  }
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error('User already exists!')
  }
  const token = jwt.sign({ email, name, password }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })
  const confirmationLink = `${process.env.SERVER_URL}api/user/confirm/${token}`
  console.log(confirmationLink)
  const html = `Xin vui lòng click vào link dưới đây để xác nhận. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href="${confirmationLink}">Click here</a>`
  const data = {
    email,
    html,
    subject: `Reset password Hieu-Shop`,
  }
  await sendEmail(data)
  return res
    .status(201)
    .json({ success: true, mes: 'Registration successful. Please check your email for confirmation.' })
})
module.exports.confirm = asyncHandler(async (req, res) => {
  const { token } = req.params
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const { email, password, name } = decoded
    const user = await User.create({ name, email, password })
    res.status(201).json({ success: true, mes: 'Registration successful', data: user })
  } catch (error) {
    throw new Error('Token hết hạn hoặc không hợp lệ')
  }
})
module.exports.loginUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  const { email, password } = req.body
  if (!email || !password) {
    throw new Error('Please fill all fields!')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Username or password is incorrect!')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Username or password is incorrect!')
  }
  const { pass, role, refreshToken, ...userData } = user.toObject()
  const accessToken = generateAccessToken(user._id, role)
  const newRefreshToken = generateRefreshToken(user._id)
  await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true })
  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
  return res.status(200).json({
    success: true,
    accessToken,
    mes: userData,
  })
})

module.exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    throw new Error('Email không tồn tại!')
  }
  const resetToken = user.getCreateToken()
  await user.save({ validateBeforeSave: false })
  const resetPasswordUrl = `${process.env.CLIENT_URL}/reset/${resetToken}`
  const html = `Link reset password của bạn là :<br/><br/> <a href=${resetPasswordUrl}>Click here</a> <br/><br/>Nếu bạn không yêu cầu reset password, hãy bỏ qua email này.`
  try {
    await sendEmail({
      email: user.email,
      subject: `Reset password Hieu-Shop`,
      html,
    })
    res.status(200).json({
      success: true,
      message: `Email gửi ${user.email} thành công`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    throw new Error('Email không thể gửi')
  }
})

module.exports.resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user) {
    throw new Error('Mã reset password không hợp lệ hoặc đã hết hạn')
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  user.password = hashedPassword
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  generateToken(res, user._id)
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? 'Updated password' : 'Something went wrong',
  })
})

module.exports.logoutUser = asyncHandler(async (req, res, next) => {
  try {
    res.clearCookie('refreshToken')
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      throw new Error('No refreshToken found in cookie')
    }
    const decodedUser = jwt.decode(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN)
    console.log('DECODED USER ====> logOut ', decodedUser)
    const isHacker = await refreshTokenReuseDetection(decodedUser, refreshToken, res, next)
    if (isHacker) {
      console.log('This user has been hacked, returning ===> ')
      return
    }
    await User.updateOne({ _id: decodedUser.id }, { $pull: { refreshToken: refreshToken } })
    return res.sendStatus(204)
  } catch (error) {
    await handleRefreshTokenError(error, req, res, next)
  }
})
module.exports.refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      res.clearCookie('refreshToken')
      throw new Error('No refreshToken found in cookie')
    }
    const decodedUser = extractUser(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN)
    req.user = decodedUser
    console.log('DECODED USER ====> refreshTokenSets ', req.user)
    const isHacker = await refreshTokenReuseDetection(decodedUser, refreshToken, res, next)
    if (isHacker) {
      console.log('This user has been hacked, returning ===> ')
      return
    }
    const tokenSet = generateToken({
      name: decodedUser.name,
      id: decodedUser.id,
      email: decodedUser.email,
    })
    const updatedRefreshToken = await userModel.updateOne(
      { _id: decodedUser.id, refreshToken: refreshToken },
      { $set: { 'refreshToken.$': tokenSet.refreshToken } }
    )
    if (updatedRefreshToken) {
      console.log('updatedRefreshToken ====> replaceRefreshTokenUser ===>  ', updatedRefreshToken)
      res.cookie('refreshToken', tokenSet.refreshToken, {
        maxAge: process.env.JWT_COOKIE_EXPIRY_TIME * 1000,
        secure: true,
        httpOnly: true, // The cookie only accessible by the web server,
        sameSite: 'none',
      })
      return res.status(200).send({
        accessToken: tokenSet.accessToken,
      })
    }
  } catch (error) {
    console.log('refreshTokenSets ===> ', error)
    await handleRefreshTokenError(error, req, res, next)
  }
})
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
})

module.exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  res.status(200).json({
    success: user ? true : false,
    _id: user ? user._id : null,
    name: user ? user.name : null,
    email: user ? user.email : null,
    isAdmin: user ? user.isAdmin : null,
  })
})

module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw new Error('Missing fields to update!')
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10)
  }
  const updateUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true })
  res.status(200).json({
    success: updateUser ? true : false,
    _id: updateUser ? updateUser._id : null,
    name: updateUser ? updateUser.name : null,
    email: updateUser ? updateUser.email : null,
    isAdmin: updateUser ? updateUser.isAdmin : null,
  })
})

module.exports.deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Cannot delete admin user')
    }

    await User.deleteOne({ _id: user._id })
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found.')
  }
})

module.exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

module.exports.updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
