const asyncHandler = require('express-async-handler')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/createToken')

module.exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    throw new Error('Please fill all fields!')
  }
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error('User already exists!')
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = await User.create({ name, email, password: hashedPassword })
  generateToken(res, user._id)
  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

module.exports.loginUser = asyncHandler(async (req, res) => {
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
  generateToken(res, user._id)
  res.status(200).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

module.exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt')
  res.status(200).json({ success: true })
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
