const { notFound, errHandler } = require('../middlewares/errHandle')
const userRoute = require('./user.route')
const categoryRoute = require('./category.route')
const productRoute = require('./product.route')
const uploadRouter = require('./upload.route')
const route = (app) => {
  app.use('/api/user', userRoute)
  app.use('/api/category', categoryRoute)
  app.use('/api/product', productRoute)
  app.use('/api/upload', uploadRouter)
  app.use(notFound)
  app.use(errHandler)
}

module.exports = route
