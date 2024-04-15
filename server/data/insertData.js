const Product = require('../models/product.model')
const asyncHandler = require('express-async-handler')
const data = require('./data2.json')
const ProductCategory = require('../models/category.model')
const category = require('./cate_brand')
async function getCategoryId(categoryName) {
  let category = await ProductCategory.findOne({ name: categoryName })
  if (!category) {
    category = await ProductCategory.create({ name: categoryName })
  }
  return category._id
}
module.exports.createProduct = asyncHandler(async (req, res) => {
  for (const item of data) {
    const categoryId = await getCategoryId(item.category[1])
    await Product.create({
      name: item?.name,
      description: item?.description, // Join các mô tả thành một chuỗi
      brand: item?.brand, // Bạn có thể thay đổi brand tùy thuộc vào dữ liệu bạn có
      price: Math.round(parseInt(item?.price?.replace(/[^0-9]/g, '') / 100)), // Chuyển đổi giá thành số
      category: categoryId, // ID của danh mục sản phẩm, bạn cần đảm bảo danh mục tồn tại trong cơ sở dữ liệu của bạn
      quantity: 500, // Số lượng mặc định
      image: item?.thumb, // Mảng hình ảnh
      countInStock: 500, // Số lượng tồn kho
    })
  }
  return res.status(200).json('ok')
})

module.exports.createProductCategory = asyncHandler(async (req, res) => {
  for (const item of category) {
    await ProductCategory.create({
      name: item?.cate,
    })
  }
  return res.status(200).json('ok')
})
