const asyncHandler = require('express-async-handler')
const Category = require('../models/category.model')

module.exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name) {
    throw new Error('Please fill all fields!')
  }
  const categoryExists = await Category.findOne({ name })
  if (categoryExists) {
    throw new Error('Category already exists!')
  }
  const category = await Category.create({ name })
  res.status(201).json({
    success: true,
    _id: category._id,
    name: category.name,
  })
})

module.exports.updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body
  const category = await Category.findById(req.params.id)
  if (!category) {
    throw new Error('Category not found!')
  }
  const categoryExists = await Category.findOne({ name })
  if (categoryExists) {
    throw new Error('Category already exists!')
  }
  response = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true })
  res.status(200).json({
    success: true,
    _id: response._id,
    name: response.name,
  })
})
module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    throw new Error('Category not found!')
  }
  await Category.findByIdAndDelete({ _id: req.params.id })
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  })
})

module.exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
  res.status(200).json(categories)
})

module.exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    throw new Error('Category not found!')
  }
  res.status(200).json({
    success: true,
    category,
  })
})
