const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware')

router.route('/').post(userController.createUser).get(authenticate, authorizeAdmin, userController.getAllUsers)
router.post('/auth', userController.loginUser)
router.post('/logout', userController.logoutUser)
router.route('/password/forgot').post(userController.forgotPassword)
router.route('/password/reset/:token').put(userController.resetPassword)

router
  .route('/profile')
  .get(authenticate, userController.getUserProfile)
  .put(authenticate, userController.updateUserProfile)
router
  .route('/:id')
  .delete(authenticate, authorizeAdmin, userController.deleteUserById)
  .get(authenticate, authorizeAdmin, userController.getUserById)
  .put(authenticate, authorizeAdmin, userController.updateUserById)

module.exports = router
