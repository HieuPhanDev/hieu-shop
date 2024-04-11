const express = require('express')
const router = express.Router()
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware')
const categoryController = require('../controllers/category.controller')
router.route('/').post(authenticate, authorizeAdmin, categoryController.createCategory)
router
  .route('/:id')
  .put(authenticate, authorizeAdmin, categoryController.updateCategory)
  .delete(authenticate, authorizeAdmin, categoryController.deleteCategory)
  .get(categoryController.getCategoryById)
router.route('/').get(categoryController.getCategories)

module.exports = router
