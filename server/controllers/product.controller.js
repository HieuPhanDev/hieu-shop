const asyncHandler = require('express-async-handler')
const Product = require('../models/product.model')

module.exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.body
  if ((!name || !description || !price || !category || !quantity, !brand)) {
    throw new Error('Please fill all fields!')
  }
  const productExists = await Product.findOne({ name })
  if (productExists) {
    throw new Error('Product already exists!')
  }
  const product = await Product.create({ ...req.body })
  res.status(201).json(product)
})
module.exports.updateProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error('Please fill to update!')
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new Error('Product not found!')
  }
  response = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.status(200).json(response)
})
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new Error('Product not found!')
  }
  await Product.findByIdAndDelete({ _id: req.params.id })
  res.status(200).json({
    message: 'Product deleted successfully',
  })
})
module.exports.getProducts = asyncHandler(async (req, res) => {
  try {
    // 1A) Filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])
    //1B) Advanced filtering
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    let query = Product.find(JSON.parse(queryString))
    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    //3) Field Limiting
    // Select pattern  .select("firstParam secondParam"), it will only show the selected field, add minus sign for excluding (include everything except the given params)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 8
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    //EXECUTE QUERY
    const response = await query
    const totalItems = await Product.countDocuments(JSON.parse(queryString))
    const totalPages = Math.ceil(totalItems / limit)
    res.status(200).json({
      status: 'success',
      results: response.length,
      totalPages: totalPages,
      data: {
        response,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    })
  }
})
module.exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new Error('Product not found!')
  }
  res.status(200).json(product)
})
module.exports.createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  if (!rating || !comment) {
    throw new Error('Please fill all fields!')
  }
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new Error('Product not found!')
  }
  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())
  if (alreadyReviewed) {
    throw new Error('Product already reviewed!')
  }
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  }
  product.reviews.push(review)
  product.numReviews = product.reviews.length
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
  await product.save()
  res.status(201).json({ message: 'Review added' })
})
