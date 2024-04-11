const express = require('express')
const router = express.Router()
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware')
const productController = require('../controllers/product.controller')

router.route('/').post(authenticate, authorizeAdmin, productController.createProduct).get(productController.getProducts)
router
  .route('/:id')
  .put(authenticate, authorizeAdmin, productController.updateProduct)
  .delete(authenticate, authorizeAdmin, productController.deleteProduct)
  .get(productController.getProductById)
router.route('/:id/review').post(authenticate, productController.createReview)

module.exports = router
